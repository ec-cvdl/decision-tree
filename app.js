fr/*******************************
 * STRUCTURE DE L’ARBRE
 *******************************/
const tree = {
    question: "À quelle fréquence souhaitez-vous utiliser l'ordinateur ?",
    answers: [
        {
            text: "Une fois par mois ou moins",
            text: "Au moins une fois par semaine",
            text: "Tous les jours",
            next: {
                question: "Quel format préfères-tu ?",
                answers: [
                    { text: "Vidéos", next: "prop1" },
                    { text: "Exercices", next: "prop2" }
                ]
            }
        },
        {
            text: "Comprendre à fond",
            next: {
                question: "Durée souhaitée ?",
                answers: [
                    { text: "Courte", next: "prop2" },
                    { text: "Longue", next: "prop3" }
                ]
            }
        }
    ]
};

/*********************************
 * RÉSULTATS FINALS
 *********************************/
const results = {
    "prop1": "Nous vous recommandons un ordinateur 'Usage Occasionnel' à 70 €",
    "prop2": "Nous vous recommandons un ordinateur 'Usage Courant à 110 €",
    "prop3": "Nous vous recommandons un ordinateur 'Usage Avancé à 150 €"
};

/*********************************
 * APP STATE
 *********************************/
let currentNode = tree;
let steps = [];   // pour la progression
let answersLog = []; // pour l'export

/*********************************
 * SELECTEURS
 *********************************/
const questionEl = document.getElementById("question");
const answersEl = document.getElementById("answers");
const progressBar = document.getElementById("progress-bar");
const restartBtn = document.getElementById("restart");

/*********************************
 * FONCTIONS
 *********************************/

function render(node) {

    // mettre à jour la progression
    const progress = Math.round((steps.length / 5) * 100);
    progressBar.style.width = progress + "%";

    // résultat final ?
    if (typeof node === "string") {
        questionEl.innerHTML = "Résultat final";
        answersEl.innerHTML = `
            <p>${results[node]}</p>
            <button class="answer-btn" onclick="exportData()">Exporter mes réponses</button>
        `;
        restartBtn.classList.remove("hidden");
        return;
    }

    // afficher la question
    questionEl.innerHTML = node.question;

    // afficher les réponses
    answersEl.innerHTML = "";
    node.answers.forEach(answer => {
        const btn = document.createElement("button");
        btn.className = "answer-btn";
        btn.textContent = answer.text;

        btn.onclick = () => {
            steps.push("step");
            answersLog.push(answer.text);
            render(answer.next);
        };

        answersEl.appendChild(btn);
    });
}

function restart() {
    steps = [];
    answersLog = [];
    restartBtn.classList.add("hidden");
    render(tree);
}

restartBtn.onclick = restart;

/*********************************
 * EXPORT DES RÉPONSES
 *********************************/
function exportData() {
    const csv = answersLog.join(",");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "reponses.csv";
    a.click();
}

/*********************************
 * LANCER L’APP
 *********************************/
render(tree);
