const text = document.getElementById("display");
const list = document.getElementById("list");
const apiBase = "http://localhost:5178/api/History";


function appendToDisplay(input) {
    text.value += input;
}

function clearDisplay() {
    text.value = "";
}

async function calculate() {
    try {
        let result = eval(text.value);
        text.value = result;
        let ip = await getIP();
        await addToHistoryBackend(text.value, result, ip);
        await loadHistory();
        
    }
    catch (error) {
        text.value = "error";
    }
}

function addToHistory() {
    var result = eval(text.value);
    var li = document.createElement("li");
    li.appendChild(document.createTextNode(`${text.value} = ${result}`));
    list.appendChild(li);
}

function hideShowHistory() {
    let button = document.getElementById("history-box");
    if (button.style.display === "none") {
        button.style.display = "block";
    }
    else {
        button.style.display = "none";
    }

}
function maxHistoryCount() {
if(list.childElementCount >= 11){
        list.removeChild(list.firstElementChild);
        console.log(list.firstChild);
    }
}
async function addToHistoryBackend(expression, result, ip) {
    const payload = {
        calc: `${expression} = ${result}`,
        ipAddress: ip
    };
    await fetch(apiBase, {
        method:"POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(payload)
    });
}
async function loadHistory() {
    list.innerHTML = ""; // clear old list
    let ip = await getIP();
    const response = await fetch(`${apiBase}/${ip}`);
    const history = await response.json();
    console.log(history.json)
    history.forEach(entry => {
        const li = document.createElement("li");
        li.textContent = `${entry.caculation}`;
        list.appendChild(li);
    });
}

async function getIP() {
            try {
                const response = await fetch('https://api.ipify.org?format=json');
                const data = await response.json();
                return data.ip;
            } catch (error) {
                console.error('Error fetching IP address:', error);
            }
        }
window.onload = loadHistory;