// Déclarez les boutons en dehors de la fonction addToColumn
let modifyButton;
let deleteButton;

document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('passwordModal');
    const closeButton = document.querySelector('.close');
    const submitButton = document.getElementById('submitButton');
    const passwordInput = document.getElementById('passwordInput');

    modal.style.display = 'block';
    passwordInput.focus();

    closeButton.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    passwordInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            validatePassword();
        }
    });

    submitButton.addEventListener('click', () => {
        validatePassword();
    });

    function validatePassword() {
        const enteredPassword = passwordInput.value;
        const correctPassword = '4321'; // Remplacez par votre mot de passe

        if (enteredPassword === correctPassword) {
            modal.style.display = 'none';
            initializeFirebase();
            setupEventListeners();
            loadProjects();

            const newProjectButton = document.getElementById('newProjectButton');
            const projectForm = document.getElementById('projectForm');

            newProjectButton.addEventListener('click', () => {
                projectForm.style.display = 'block';
            });
        } else {
            alert('Accès refusé. Mot de passe incorrect.');
            window.location.href = 'index.html';
        }
    }

    function initializeFirebase() {
        const firebaseConfig = {
            apiKey: "Votre_apiKey",
            authDomain: "Votre_authDomain",
            projectId: "Votre_projectId",
            storageBucket: "Votre_storageBucket",
            messagingSenderId: "Votre_messagingSenderId",
            appId: "Votre_appId",
            measurementId: "Votre_measurementId"
        };

        // Initialiser Firebase avec la configuration ci-dessus
        firebase.initializeApp(firebaseConfig);
    }

    function setupEventListeners() {
        const newProjectButton = document.getElementById('newProjectButton');
        const projectForm = document.getElementById('projectForm');

        newProjectButton.addEventListener('click', () => {
            projectForm.style.display = 'block';
        });

        const validateButton = document.getElementById('validateButton');
        const cancelButton = document.getElementById('cancelButton');

        validateButton.addEventListener('click', () => {
            validateProject();
        });

        cancelButton.addEventListener('click', () => {
            cancelProject();
        });
    }

    function validateProject() {
        const title = document.getElementById('title').value;
        const target = document.getElementById('target').value;
        const priority = document.getElementById('priority').value;
        const department = document.getElementById('department').value;
        const result = document.getElementById('result').value;

        const project = { title, target, priority, department, result };

        addProjectToFirebase(project, (projectKey) => {
            addToColumn(projectKey, project);
            clearForm();
            loadProjects();
            cancelProject();
        });
    }

    function addToColumn(projectKey, project) {
        const column = document.getElementById(project.target);
        const departmentText = {
            completed: 'Completed',
            current: 'Current',
            'near-term': 'Near-term',
            future: 'Future'
        };
        const priorityText = {
            high: 'High',
            med: 'Medium',
            low: 'Low'
        };

        const projectDiv = document.createElement('div');
        projectDiv.classList.add('project');
        projectDiv.innerHTML = `
            <p>${project.title}</p>
            <p>${project.department}</p>
            <p>${priorityText[project.priority]}</p>
            ${project.result ? `<p>${project.result}</p>` : ''}
        `;

        const checkBox = document.createElement('input');
        checkBox.type = 'checkbox';
        checkBox.style.marginRight = '5px';
        checkBox.addEventListener('change', () => {
            if (checkBox.checked) {
                modifyButton.style.display = 'inline-block';
                deleteButton.style.display = 'inline-block';
            } else {
                modifyButton.style.display = 'none';
                deleteButton.style.display = 'none';
            }
        });
        projectDiv.appendChild(checkBox);

        // Utilisez les boutons déclarés globalement
        modifyButton = document.createElement('button');
        modifyButton.textContent = 'Edit';
        modifyButton.style.display = 'none';
        modifyButton.onclick = () => editProject(projectKey, project);
        projectDiv.appendChild(modifyButton);

        deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.style.display = 'none';
        deleteButton.onclick = () => deleteProject(projectKey);
        projectDiv.appendChild(deleteButton);

        column.appendChild(projectDiv);
    }

    function cancelProject() {
        const projectForm = document.getElementById('projectForm');
        projectForm.style.display = 'none';
    }

    function clearForm() {
        document.getElementById('title').value
