
window.addEventListener('load', getIP);
let ipad = document.getElementById('ipadd');
let ipadre;
async function getIP() {
  try {
    const ipResponse = await fetch('https://api.ipify.org?format=json');
    const ipData = await ipResponse.json();
    const ipAddress = ipData.ip;
    ipadre = ipAddress
    ipad.textContent = ipadre
  
  } catch (error) {
    console.error('Error:', error);
  }
}

let ifrm = document.getElementById('ifrm');
let btn = document.getElementById('gdata')
let main = document.querySelector('.main')
async function getdata(data) {
    try{
    btn.style.display = 'none'
    main.style.display = 'block'
    const geoResponse = await fetch(`https://ipinfo.io/${ipadre}?token=a65aa5704d8782`);
    const geoData = await geoResponse.json();
    display(geoData)
    
    }
    catch(e) {
       console.log('unable to retrive geolocation data',e);  
    }

}
function display(data) {
    let city = document.getElementById('city');
    let org = document.getElementById('org');
    let region = document.getElementById('region');
    let host = document.getElementById('host');
    let tz = document.getElementById('tz');
    let lat = document.getElementById('lat');
    let long = document.getElementById('long');
    let dt = document.getElementById('dt');
    let pin = document.getElementById('pin');
    city.textContent = data.city;
    org.textContent = data.org;
    region.textContent = data.region;
    host.textContent = data.hostname;
    tz.textContent = data.timezone;
    pin.textContent = data.postal;
    lat.textContent = data.loc.split(",")[0];
    long.textContent = data.loc.split(",")[1];
    ifrm.src = `https://maps.google.com/maps?q=${lat.textContent},${long.textContent}&z=15&output=embed`;
  
    const now = new Date();
    const options = { timeZone: tz.textContent };
    const dateTimeString = now.toLocaleString('en-IN', options);
    dt.textContent = dateTimeString;
  
    getpostofc(pin.textContent);
}


// Function to fetch and display post offices
let postdata = [];
async function getpostofc(pin) {
  try {
    let end = `https://api.postalpincode.in/pincode/${pin}`;
    let getd = await fetch(end);
    let fdata = await getd.json();
    console.log(fdata);
    postdata = fdata;
    displaypost(postdata);
  } catch (e) {
    console.log('Unable to fetch post office data', e);
  }
}

// Function to display post offices
let con = document.querySelector('#grd2');

function displaypost(data) {
  let no = document.getElementById('npin');
  no.textContent = data[0].Message;

  if (!Array.isArray(data[0].PostOffice)) {
    console.error('Invalid post office data');
    return;
  }

  const postOffices = data[0].PostOffice;

  if (postOffices.length === 0) {
    con.innerText = 'No post offices found';
    return;
  }

  con.innerHTML = '';
  postOffices.forEach((postOffice) => {
    let item = document.createElement('div');
    item.className = 'item';
    item.innerHTML += `
      <ul>
        <li>Name: ${postOffice.Name}</li>
        <li>Branch Type: ${postOffice.BranchType}</li>
        <li>Delivery Status: ${postOffice.DeliveryStatus}</li>
        <li>District: ${postOffice.District}</li>
        <li>Division: ${postOffice.Division}</li>
      </ul>
    `;
    con.appendChild(item);
  });
}

let ser = document.querySelector('.icon');
ser.addEventListener('keyup', (e) => {
  getoptdata(e.target.value);
});

function opt(getpostdata, t) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      getpostdata(...args);
    }, t);
  };
}

function getpostdata(val) {
  let cval = val.toLowerCase();

  const postofcdata = postdata[0].PostOffice;
  let data = postofcdata.filter((d) => {
    let names = d.Name.toLowerCase();
    let branch = d.BranchType.toLowerCase();
    return names.includes(cval) || branch.includes(cval);
  });

  console.log('filtereddddddd', data);
  if (data.length === 0) {
    con.innerText = 'No matches found';
  } else {
    console.log('rendered', data);
    con.innerHTML = '';
    const datas = [{ PostOffice: data }];
    displaypost(datas);
  }
}

let getoptdata = opt(getpostdata, 300);



