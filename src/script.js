let submitBtn = document.querySelector(".submit-btn");

function getExpenseFromStorage() {
    const expenceArr = JSON.parse(localStorage.getItem("expenceArr"));
    return expenceArr === null ? [] : expenceArr;
}

function getBasicInfoFromStorage() {
    const basicInfo = JSON.parse(localStorage.getItem("basicInfo"));
    return basicInfo === null ? {} : basicInfo;
}

function addExpenseToStorage(eInfo) {
    const expenceArr = getExpenseFromStorage();
    localStorage.setItem("expenceArr", JSON.stringify([...expenceArr, eInfo]));
}

function removeExpenseInfoFromLocalStorage(eInfo) {
    let expenceArr = getExpenseFromStorage();

    console.log(eInfo.children[1].innerText);

    let filteredExpences = expenceArr.filter((expence) => {
        return (
            expence.info != eInfo.children[0].innerText.trim() &&
            expence.amount != eInfo.children[1].innerText.trim()
        );
    });

    localStorage.setItem("expenceArr", JSON.stringify(filteredExpences));
}

document.querySelector(".balance").innerText = JSON.parse(
    getBasicInfoFromStorage()?.totalAmount === undefined
        ? 0
        : getBasicInfoFromStorage().totalAmount
);

document.querySelector(".name").innerText = getBasicInfoFromStorage().name;

function renderExpences() {
    let ulContainer = document.querySelector(".history-ul");

    let expenceArr = getExpenseFromStorage();

    ulContainer.innerHTML = "";

    expenceArr.forEach((exp) => {
        ulContainer.innerHTML += `
            <li>
                <p class="show-info">
                    ${exp.info}
                </p>

                <span class="show-money">${exp.amount}Rs</span>
                <button class="delete-entry btn btn-danger btn-outline">Delete</button>
            </li>
        `;
    });
}

renderExpences();

submitBtn.addEventListener("click", function () {
    let info = document.querySelector(".expense-info").value;
    let amount = parseInt(document.querySelector(".expense-amount").value);
    let checkSpent = document.querySelector(".check-spent");
    let checkEarned = document.querySelector(".check-earned");

    if (info !== "" && amount !== "") {
        let expenseObj = {
            info: info,
            amount: amount,
        };

        let basicInfo = getBasicInfoFromStorage();

        if (checkSpent.checked) {
            basicInfo = {
                ...basicInfo,
                totalAmount: parseInt(basicInfo.totalAmount) - amount,
            };
        } else if (checkEarned.checked) {
            basicInfo = {
                ...basicInfo,
                totalAmount: parseInt(basicInfo.totalAmount) + amount,
            };
        }

        addExpenseToStorage(expenseObj);

        localStorage.setItem("basicInfo", JSON.stringify(basicInfo));

        let balanceSpan = document.querySelector(".balance");
        balanceSpan.innerHTML = parseInt(basicInfo.totalAmount);

        if (parseInt(basicInfo.totalAmount) < 0) {
            balanceSpan.style.color = "red";
        } else {
            balanceSpan.style.color = "green";
        }

        let ulContainer = document.querySelector(".history-ul");

        let expenceArr = getExpenseFromStorage();

        ulContainer.innerHTML = "";

        expenceArr.forEach((exp) => {
            ulContainer.innerHTML += `
                <li>
                    <p class="show-info">
                        ${exp.info}
                    </p>
    
                    <span class="show-money">${exp.amount}Rs</span>
                    <button class="delete-entry btn btn-danger btn-outline">Delete</button>
                </li>
            `;
        });
    }
});

let deleteExpense = document.querySelector(".delete-entry");
let ulContainer = document.querySelector(".history-ul");

ulContainer.addEventListener("click", (e) => {
    if (e.target.classList.contains("delete-entry")) {
        if (e.target.parentNode.tagName === "LI") {
            removeExpenseInfoFromLocalStorage(e.target.parentNode);
            renderExpences();
        } else if (e.target.tagName === "LI") {
            removeExpenseInfoFromLocalStorage(e.target);
            renderExpences();
        }
    }
});

function addRemoveForm() {
    console.log(getBasicInfoFromStorage()?.name);
    if (
        getExpenseFromStorage().length === 0 &&
        !getBasicInfoFromStorage()?.name
    ) {
        document.querySelector(".info-form").style.opacity = 1;
        document.querySelector(".info-form").style.display = "block";
        document.querySelector(".main-container").style.display = "none";

        console.log("aimhere");

        let btn = document.querySelector(".submit-info");

        btn.addEventListener("click", () => {
            let obj = {
                name: document.querySelector(".name-input").value,
                email: document.querySelector(".email-input").value,
                amount: 0,
            };

            localStorage.setItem("basicInfo", JSON.stringify(obj));

            location.reload();
        });
    } else {
        document.querySelector(".info-form").style.display = "none";
        document.querySelector(".main-container").style.display = "block";
    }
}
