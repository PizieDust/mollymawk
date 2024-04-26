// fetchAndDisplayInfo();
// const pollingInterval = 3000;
let previousContent = [];
// setInterval(fetchAndDisplayInfo, pollingInterval);

async function fetchUnikernelInfo() {
  try {
    const response = await fetch("/unikernel-info");
    const data = await response.json();
    console.log("Fetched content:", data);
    return data;
  } catch (error) {
    console.error("Error fetching content:", error);
    return [];
  }
}


async function fetchAndDisplayInfo() {
  const content = await fetchUnikernelInfo();
  const emptyMessage = document.getElementById("no-molly");
  const uniTable = document.getElementById("unikernel-info");
  const uniTHead = document.createElement("thead");
  const uniTBody = document.createElement("tbody");
  const nameTitle = document.createElement("th");
  const typTitle = document.createElement("th");
  const cpuTitle = document.createElement("th");
  const memTitle = document.createElement("th");
  nameTitle.classList.add("text-white","px-6","bg-blueGray-50","text-blueGray-500","align-middle","border","border-solid","border-blueGray-100","py-3", "text-xs","uppercase","border-l-0","border-r-0","whitespace-nowrap","font-semibold","text-left");
  typTitle.classList.add("text-white","px-6","bg-blueGray-50","text-blueGray-500","align-middle","border","border-solid","border-blueGray-100","py-3", "text-xs","uppercase","border-l-0","border-r-0","whitespace-nowrap","font-semibold","text-left");
  cpuTitle.classList.add("text-white","px-6","bg-blueGray-50","text-blueGray-500","align-middle","border","border-solid","border-blueGray-100","py-3", "text-xs","uppercase","border-l-0","border-r-0","whitespace-nowrap","font-semibold","text-left");
  memTitle.classList.add("text-white","px-6","bg-blueGray-50","text-blueGray-500","align-middle","border","border-solid","border-blueGray-100","py-3", "text-xs","uppercase","border-l-0","border-r-0","whitespace-nowrap","font-semibold","text-left");
  nameTitle.textContent = "Name";
  typTitle.textContent = "Type";
  cpuTitle.textContent = "CPU";
  memTitle.textContent = "Memory";
  uniTHead.appendChild(nameTitle);
  uniTHead.appendChild(typTitle);
  uniTHead.appendChild(cpuTitle);
  uniTHead.appendChild(memTitle);
  uniTable.appendChild(uniTHead);

  if (content.length === 0) {
    emptyMessage.classList.remove("hidden");
    emptyMessage.classList.add("block");
  } else {
    content.forEach(async item => {
      if (!previousContent.some(prevItem => prevItem.name === item.name)) {
        const tr = document.createElement("tr");
        const title = document.createElement("td");
        const type = document.createElement("td");
        const cpu = document.createElement("td");
        const memory = document.createElement("td");

        const stopButtonLink = document.createElement("a");
        stopButtonLink.classList.add("py-2", "px-3", "rounded", "bg-blue-500", "text-white");
        stopButtonLink.textContent = "Stop"
        stopButtonLink.href = `unikernel/shutdown/${item.name}`;

        const viewButtonDiv = document.createElement("div");
        viewButtonDiv.classList.add("my-3");
        const viewButton = document.createElement("button");
        viewButton.classList.add("py-1","px-3","rounded", "bg-transparent", "border", "border-2", "text-white", "hover:bg-gray-300", "hover:text-black");
        viewButton.textContent = "View"
        viewButton.addEventListener("click", (event) => getUnikernelInfo(item));
        // viewButtonLink.href = `unikernel/info/${item.name}`;

        title.classList.add("text-gray-200","border-t-0","px-6","align-middle","border-l-0","border-r-0","text-md","whitespace-nowrap","p-4");
        type.classList.add("text-gray-200","border-t-0","px-6","align-middle","border-l-0","border-r-0","text-md","whitespace-nowrap","p-4")
        cpu.classList.add("text-gray-200","border-t-0","px-6","align-middle","border-l-0","border-r-0","text-md","whitespace-nowrap","p-4");
        memory.classList.add("text-gray-200","border-t-0","px-6","align-middle","border-l-0","border-r-0","text-md","whitespace-nowrap","p-4");

        tr.classList.add("my-2");
        title.textContent = item.name.substring(1);
        type.textContent = item.typ;
        cpu.textContent = item.cpuid;
        memory.textContent = item.memory + "MB";

        tr.appendChild(title);
        tr.appendChild(type);
        tr.appendChild(cpu);
        tr.appendChild(memory);
        viewButtonDiv.appendChild(viewButton);
        tr.appendChild(viewButtonDiv)
        uniTBody.appendChild(tr);
      }
    });
    uniTable.appendChild(uniTBody);
  }

  previousContent = content;
}



document.addEventListener("DOMContentLoaded", function() {
  fetchAndDisplayInfo()
  const createButton = document.getElementById("add-btn")
  createButton.addEventListener("click", (event) => {
    window.location.replace("/unikernel/create")
  });

  const deployButton = document.getElementById("deploy-unikernel")
  deployButton.addEventListener("click", (event) => {
    deployUnikernel()
  })
});



function getUnikernelInfo(unikernel)
{

  fetch("/unikernel/info/"+unikernel.name, {
    method: "get",
  })
    .then((response) => response.json())
    .then((responseText) => {
      console.log(responseText[0].name)
         const mollyText = document.getElementById("molly-text");
         const mollyDesc = document.getElementById("molly-desc");
         const createBtn = document.getElementById("add-btn")
         createBtn.classList.add("hidden")
         mollyText.classList.remove("text-center", "text-3xl")
         mollyText.classList.add("text-left", "text-sm")
         mollyDesc.classList.add("hidden")
        const shutdownButtonDiv = document.createElement("div");
        shutdownButtonDiv.classList.add("text-right", "my-3")
        const shutdownButtonLink = document.createElement("a");
        shutdownButtonLink.classList.add("my-3");
        shutdownButtonLink.classList.add("py-2", "px-3", "rounded", "bg-red-500", "text-white", "hover:bg-red-700");
        shutdownButtonLink.textContent = "Shutdown"
        shutdownButtonLink.href = `unikernel/shutdown/${unikernel.name}`;
        shutdownButtonDiv.appendChild(shutdownButtonLink)
      // window.location.replace("/unikernel/"+unikernel.name)
      const uniTable = document.getElementById("unikernel-info");
      uniTable.classList.add("hidden")
      const uniDiv = document.getElementById("unikernel-container");
      uniDiv.classList.remove("hidden")
      uniDiv.classList.add("block")
      let uni = responseText[0];
      const name = document.createElement("h2");
      name.textContent = uni.name;
      const digest = document.createElement("p");
      digest.classList.add("text-xs", "text-white", "font-semibold")
      digest.textContent = uni.digest
      name.classList.add("text-3xl", 'font-semibold', 'text-blue-500', 'uppercase');

      const infoDiv = document.createElement("div");
      infoDiv.classList.add("grid", "grid-cols-3", "gap-3", "text-white", "my-5")

      const cpuDiv = document.createElement("div");
      cpuDiv.classList.add("p-4", "rounded", "bg-gray-900")
      const cpuSubDiv = document.createElement("div");
      cpuSubDiv.classList.add("flex", "justify-between")
      const cpu = document.createElement("p");
      const cpuLabel = document.createElement("p");
      cpu.classList.add("text-3xl", "text-right")
      cpuLabel.classList.add("text-md")
      cpu.textContent = `${uni.cpuid}`
      cpuLabel.textContent = "CPU"
      const cpuIcon = document.createElement("i");
      cpuIcon.classList.add("fa-solid","fa-microchip", "text-md")
      cpuSubDiv.appendChild(cpuIcon);
      cpuSubDiv.appendChild(cpuLabel);
      cpuDiv.appendChild(cpuSubDiv)
      cpuDiv.appendChild(cpu)

      const memDiv = document.createElement("div");
      memDiv.classList.add("p-4", "rounded", "bg-gray-900")
      const memSubDiv = document.createElement("div");
      memSubDiv.classList.add("flex", "justify-between")
      const mem = document.createElement("p");
      const memLabel = document.createElement("p");
      mem.classList.add("text-3xl","text-right")
      mem.textContent = `${uni.memory}MB`
      memLabel.textContent = "Memory"
      const memIcon = document.createElement("i");
      memIcon.classList.add("fa-solid","fa-hard-drive", "text-md")
      memSubDiv.appendChild(memIcon);
      memSubDiv.appendChild(memLabel);
      memDiv.appendChild(memSubDiv)
      memDiv.appendChild(mem);

      const typDiv = document.createElement("div");
      const typSubDiv = document.createElement("div")
      typDiv.classList.add("p-4", "rounded", "bg-gray-900")
      typSubDiv.classList.add("flex", "justify-between")
      const typ = document.createElement("p");
      const typLabel = document.createElement("p")
      typ.classList.add("text-3xl","text-right")
      typ.textContent = `${uni.typ}`
      typLabel.textContent = "Type"
      const typIcon = document.createElement("i");
      typIcon.classList.add("fa-solid","fa-warehouse", "text-md")
      typSubDiv.appendChild(typIcon);
      typSubDiv.appendChild(typLabel);
      typDiv.appendChild(typSubDiv)
      typDiv.appendChild(typ)


      const otherInfo = document.createElement("div");
      otherInfo.classList.add("rounded", "my-4", "bg-gray-900", "text-white", "p-4", "divide-y-2")

      const argDiv = document.createElement("div")
      const argLabel = document.createElement("p")
      argLabel.classList.add("text-xl", "font-semibold", "text-blue-700")
      argLabel.textContent = "Arguments"
      argDiv.appendChild(argLabel);
      uni.arguments.forEach(arg => {
        const argP = document.createElement("p")
        const br = document.createElement("br")
        argP.textContent = arg
        argDiv.appendChild(argP)
        argDiv.appendChild(br)
      })

      const blockDiv = document.createElement("div")
      blockDiv.classList.add("my-4")
      const blockLabel = document.createElement("p")
      blockLabel.classList.add("text-xl", "font-semibold", "text-blue-700")
      blockLabel.textContent = "Block Devices"
      blockDiv.appendChild(blockLabel);
      const blockTable = document.createElement("table")
      blockTable.classList.add("items-center", "bg-transparent", "w-full", "border-collapse")
      const blockTHead = document.createElement("thead");
      const blockTBody = document.createElement("tbody");
      const hostTitle = document.createElement("th");
      const nameTitle = document.createElement("th");
      const sectorTitle = document.createElement("th");
      hostTitle.textContent = "Host device";
      nameTitle.textContent = "Name";
      sectorTitle.textContent = "Sector size";
      hostTitle.classList.add("text-gray-200","border-t-0","px-6","align-middle","border-l-0","border-r-0","text-md","whitespace-nowrap","p-4");
      nameTitle.classList.add("text-gray-200","border-t-0","px-6","align-middle","border-l-0","border-r-0","text-md","whitespace-nowrap","p-4")
      sectorTitle.classList.add("text-gray-200","border-t-0","px-6","align-middle","border-l-0","border-r-0","text-md","whitespace-nowrap","p-4");
      blockTHead.appendChild(hostTitle);
      blockTHead.appendChild(nameTitle);
      blockTHead.appendChild(sectorTitle);

      uni.block_devices.forEach(block => {
        const tr = document.createElement("tr");
        const host = document.createElement("td");
        const name = document.createElement("td");
        const size = document.createElement("td");

        host.textContent = block.host_device
        name.textContent = block.name
        size.textContent = block.sector_size

        host.classList.add("text-gray-200","text-center");
        name.classList.add("text-gray-200","text-center");
        size.classList.add("text-gray-200","text-center");

        tr.appendChild(host)
        tr.appendChild(name)
        tr.appendChild(size)
        blockTBody.appendChild(tr)

      })
      blockTable.appendChild(blockTHead)
      blockTable.appendChild(blockTBody)
      blockDiv.appendChild(blockTable)

      const networkDiv = document.createElement("div")
      networkDiv.classList.add("my-4")
      const networkLabel = document.createElement("p")
      networkLabel.classList.add("text-xl", "font-semibold", "text-blue-700")
      networkLabel.textContent = "Network Interfaces"
      networkDiv.appendChild(networkLabel);
      const networkTable = document.createElement("table")
      networkTable.classList.add("items-center", "bg-transparent", "w-full", "border-collapse")
      const networkTHead = document.createElement("thead");
      const networkTBody = document.createElement("tbody");
      const networkHost = document.createElement("th");
      const networkMac = document.createElement("th");
      const networkName = document.createElement("th");
      networkHost.textContent = "Host device";
      networkMac.textContent = "MAC Address";
      networkName.textContent = "Name";
      networkHost.classList.add("text-gray-200","border-t-0","px-6","align-middle","border-l-0","border-r-0","text-md","whitespace-nowrap","p-4");
      networkMac.classList.add("text-gray-200","border-t-0","px-6","align-middle","border-l-0","border-r-0","text-md","whitespace-nowrap","p-4")
      networkName.classList.add("text-gray-200","border-t-0","px-6","align-middle","border-l-0","border-r-0","text-md","whitespace-nowrap","p-4");
      networkTHead.appendChild(networkName);
      networkTHead.appendChild(networkHost);
      networkTHead.appendChild(networkMac);

      uni.network_interfaces.forEach(net => {
        const tr = document.createElement("tr");
        const host = document.createElement("td");
        const mac = document.createElement("td");
        const name = document.createElement("td");

        host.textContent = net.host_device
        mac.textContent = net.mac
        name.textContent = net.name

        host.classList.add("text-gray-200","text-center");
        name.classList.add("text-gray-200","text-center");
        mac.classList.add("text-gray-200","text-center");

        tr.appendChild(name)
        tr.appendChild(host)
        tr.appendChild(mac)
        networkTBody.appendChild(tr)

      })
      networkTable.appendChild(networkTHead)
      networkTable.appendChild(networkTBody)
      networkDiv.appendChild(networkTable)

      const failDiv = document.createElement("div")
      failDiv.classList.add("my-4")
      const failLabel = document.createElement("p")
      failLabel.classList.add("text-xl", "font-semibold", "text-blue-700")
      failLabel.textContent = "Fail Behaviour"
      failDiv.appendChild(failLabel);
      const f = document.createElement("p");
      f.textContent = uni.fail_behaviour
      failDiv.appendChild(f)


      otherInfo.appendChild(argDiv)
      otherInfo.appendChild(blockDiv)
      otherInfo.appendChild(networkDiv)
      otherInfo.appendChild(failDiv)


      uniDiv.appendChild(name);
      uniDiv.appendChild(digest);
      infoDiv.appendChild(cpuDiv);
      infoDiv.appendChild(memDiv);
      infoDiv.appendChild(typDiv);
      uniDiv.appendChild(infoDiv);
      uniDiv.appendChild(otherInfo);
      uniDiv.appendChild(shutdownButtonDiv);

    })
    .catch((error) => {
      console.error(error)
    })
    .finally(() => {

    });
}

function deployUnikernel() {
  let binaryUnikernel = document.getElementById("unikernel-binary")
  let binaryFile = Array.from(binaryUnikernel.files)[0]
  let name = document.getElementById("unikernel-name")
  let arguments = document.getElementById("unikernel-arguments")
  let argumentsData = JSON.stringify(arguments.value)
  let formData = new FormData();
  formData.append("name", name.value);
  formData.append("binary", binaryFile)
  formData.append("arguments", argumentsData)
  // Disable the button temporarily to prevent multiple click

  // Send post request to unikernel with the formData
  fetch("/unikernel/deploy", {
    method: "POST",
    body: formData,
    mode: "no-cors",
  })
    .then((response) => response.text())
    .then((responseText) => {
      console.log(responseText)
    })
    .catch((error) => {
      console.error(error)
    })
    .finally(() => {

    });
}