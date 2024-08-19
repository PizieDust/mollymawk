open Utils.Json

type t = {
  version : int;
  users : User_model.user list;
  configuration : Configuration.t;
}

let current_version = 1

let t_to_json t =
  `Assoc
    [
      ("version", `Int t.version);
      ("users", `List (List.map User_model.user_to_json t.users));
      ("configuration", Configuration.to_json t.configuration);
    ]

let t_of_json now json =
  match json with
  | `Assoc xs -> (
      let ( let* ) = Result.bind in
      match (get "version" xs, get "users" xs, get "configuration" xs) with
      | Some (`Int v), Some (`List users), Some configuration ->
          let* () =
            if v = current_version then Ok ()
            else
              Error
                (`Msg
                  (Fmt.str "expected version %u, found version %u"
                     current_version v))
          in
          let* users =
            List.fold_left
              (fun acc js ->
                let* acc = acc in
                let* user = User_model.user_of_json js in
                Ok (user :: acc))
              (Ok []) users
          in
          let* configuration = Configuration.of_json configuration now in
          Ok { version = v; users; configuration }
      | _ -> Error (`Msg "invalid data: no version and users field"))
  | _ -> Error (`Msg "invalid data: not an assoc")

let error_msgf fmt = Fmt.kstr (fun msg -> Error (`Msg msg)) fmt

module Make (BLOCK : Mirage_block.S) = struct
  module Stored_data = OneFFS.Make (BLOCK)

  type store = t * BLOCK.t

  open Lwt.Infix

  let write_data (disk, t) =
    Stored_data.write disk (Yojson.Basic.to_string (t_to_json t))

  let read_data now disk =
    Stored_data.read disk >|= function
    | Ok (Some s) ->
        let ( let* ) = Result.bind in
        let* json =
          try Ok (Yojson.Basic.from_string s)
          with Yojson.Json_error msg -> Error (`Msg ("Invalid json: " ^ msg))
        in
        let* t = t_of_json now json in
        Ok (disk, t)
    | Ok None ->
        Ok
          ( disk,
            {
              version = current_version;
              users = [];
              configuration = Configuration.empty ();
            } )
    | Error e ->
        error_msgf "error while reading storage: %a" Stored_data.pp_error e

  let add_user (disk, t) user =
    let t = { t with users = user :: t.users } in
    write_data (disk, t) >|= function
    | Ok () -> Ok (disk, t)
    | Error we ->
        error_msgf "error while writing storage: %a" Stored_data.pp_write_error
          we

  let update_user (disk, t) (user : User_model.user) =
    let users =
      List.map
        (fun (u : User_model.user) ->
          match u.uuid = user.uuid with true -> user | false -> u)
        t.users
    in
    let t = { t with users } in
    write_data (disk, t) >|= function
    | Ok () -> Ok (disk, t)
    | Error we ->
        error_msgf "error while writing storage: %a" Stored_data.pp_write_error
          we

  let update_configuration (disk, t) (configuration : Configuration.t) =
    let t = { t with configuration } in
    write_data (disk, t) >|= function
    | Ok () -> Ok (disk, t)
    | Error we ->
        error_msgf "error while writing storage: %a" Stored_data.pp_write_error
          we
end
