const API_BASE = "http://localhost:5000/api"; // Update if deploying online

const loginForm = document.getElementById("login-form");
const loginPage = document.getElementById("login-page");
const homePage = document.getElementById("home-page");
const dashboardPage = document.getElementById("dashboard-page");
const historyPage = document.getElementById("history-page");
const landingPage = document.getElementById("landing-page");
const analysisPage = document.getElementById("analysis-page");

const dashboardButton = document.getElementById("dashboard-button");
const analyzeButton = document.getElementById("analyze-button");
const historyButton = document.getElementById("history-button");
const backDashboardButton = document.getElementById("back-dashboard");

const allowAccessButton = document.getElementById("allow-access");
const analyzeForm = document.getElementById("analyze-form");
const resultBox = document.getElementById("result");
const reportButton = document.getElementById("report-button");
const fakeCountDisplay = document.getElementById("fake-count");
const historyList = document.getElementById("history-list");
const reportDetails = document.getElementById("report-details");

let fakeCount = 0;
let reportedAccounts = [];
let currentUserId = "";

// Navigation Logic
loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const userId = document.getElementById("user-id").value;
    const email = document.getElementById("email").value;

    const response = await fetch(`${API_BASE}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, email })
    });

    if (response.ok) {
        currentUserId = userId;
        loginPage.classList.add("hidden");
        homePage.classList.remove("hidden");
    }
});

dashboardButton.addEventListener("click", () => {
    homePage.classList.add("hidden");
    dashboardPage.classList.remove("hidden");
});

analyzeButton.addEventListener("click", () => {
    dashboardPage.classList.add("hidden");
    landingPage.classList.remove("hidden");
});

historyButton.addEventListener("click", async () => {
    dashboardPage.classList.add("hidden");
    historyPage.classList.remove("hidden");

    const res = await fetch(`${API_BASE}/history/${currentUserId}`);
    const history = await res.json();

    historyList.innerHTML = history.map(item =>
        `<li>${item.handle} - ${item.status} at ${new Date(item.detectedAt).toLocaleString()}</li>`
    ).join("");
});

backDashboardButton.addEventListener("click", () => {
    historyPage.classList.add("hidden");
    dashboardPage.classList.remove("hidden");
});

allowAccessButton.addEventListener("click", () => {
    landingPage.classList.add("hidden");
    analysisPage.classList.remove("hidden");
});

analyzeForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const handle = document.getElementById("handle").value.trim();
    resultBox.innerText = "";
    reportButton.classList.add("hidden");
    resultBox.classList.remove("success", "error");
    reportDetails.classList.add("hidden");

    const isFake = simulateFakeDetection(handle);

    if (isFake) {
        resultBox.innerText = `⚠ Account "${handle}" is flagged as a fake account.`;
        resultBox.classList.add("error");
        reportButton.classList.remove("hidden");

        reportButton.onclick = async () => {
            const detectedTime = new Date().toLocaleString();
            await fetch(`${API_BASE}/report`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userId: currentUserId, handle })
            });

            fakeCount++;
            fakeCountDisplay.innerText = fakeCount;
            reportedAccounts.push(handle);

            reportDetails.innerHTML = `
                <h3>InstaGuard Fake Account Report</h3>
                <p><strong>Account Handle:</strong> @${handle}</p>
                <p><strong>Status:</strong> Fake Account</p>
                <p><strong>Detected on:</strong> ${detectedTime}</p>
                <p>This account has been flagged for suspicious activity and is marked as fake.</p>
            `;
            reportDetails.classList.remove("hidden");
        };
    } else {
        resultBox.innerText = `✅ Account "${handle}" appears authentic.`;
        resultBox.classList.add("success");
    }
});

function simulateFakeDetection(handle) {
    const suspiciousPatterns = ["bot", "spam", "fake"];
    return suspiciousPatterns.some(pattern => handle.toLowerCase().includes(pattern));
}
