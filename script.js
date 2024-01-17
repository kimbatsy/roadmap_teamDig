document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('passwordModal');
    const closeButton = document.querySelector('.close');
    const submitButton = document.getElementById('submitButton');
    const passwordInput = document.getElementById('passwordInput');

    // Afficher la boîte de dialogue
    modal.style.display = 'block';
    passwordInput.focus();
    // Fermer la boîte de dialogue en cliquant sur la croix
    closeButton.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    // Valider la saisie lors de l'appui sur la touche "Entrée"
    passwordInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            validatePassword();
        }
    });

    // Récupérer le mot de passe lors de la soumission
    submitButton.addEventListener('click', () => {
        validatePassword();
    });

    function validatePassword() {
        const enteredPassword = passwordInput.value;
        const correctPassword = '4321'; // Remplacez par votre mot de passe

        if (enteredPassword === correctPassword) {
            modal.style.display = 'none';
            // Charger l'application une fois le mot de passe correct saisi
            // Par exemple, charger les projets depuis Firebase
            initializeFirebase();
        } else {
            alert('Accès refusé. Mot de passe incorrect.');
            window.location.href = 'index.html';
        }
    }
});

function initializeFirebase() {
    const firebaseConfig = {
      apiKey: "AIzaSyCFd7dBcDV7iJzhBsiVw_MX07pSSHlAY4g",
      authDomain: "roadmap-3a26c.firebaseapp.com",
      projectId: "roadmap-3a26c",
      storageBucket: "roadmap-3a26c.appspot.com",
      messagingSenderId: "668596727318",
      appId: "1:668596727318:web:e88f9c8948451d0b0f4f37",
      measurementId: "G-E9NJKB1338"
    };

    firebase.initializeApp(firebaseConfig);
    loadProjects();
    setupEventListeners();
}

function setupEventListeners() {
    const newProjectButton = document.getElementById('newProjectButton');
    const projectForm = document.getElementById('projectForm');

    newProjectButton.addEventListener('click', () => {
        projectForm.style.display = 'block';
    });

    // Autres gestionnaires d'événements ici
}

// Fonctions pour sauvegarder, supprimer, charger les projets, etc.
// Utilisez les méthodes Firebase pour interagir avec la base de données
// Par exemple :
// firebase.database().ref('chemin_dans_la_base_de_données').push(data);
// firebase.database().ref('chemin_dans_la_base_de_données').remove();

// Assurez-vous d'adapter les méthodes Firebase en fonction de votre structure de données
