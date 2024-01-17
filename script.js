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
            // Par exemple, charger les projets depuis le localStorage
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
});


function validateProject() {
    const title = document.getElementById('title').value;
    const target = document.getElementById('target').value;
    const priority = document.getElementById('priority').value;
    const department = document.getElementById('department').value;
    const result = document.getElementById('result').value;

    const project = { title, target, priority, department, result };
    saveToLocalStorage(project);
    clearForm(); // Vide le formulaire après ajout
    loadProjects(); // Recharge les projets après ajout

    cancelProject(); // Masquer le formulaire après validation
}

function cancelProject() {
    const projectForm = document.getElementById('projectForm');
    projectForm.style.display = 'none';
}

function clearForm() {
    document.getElementById('title').value = '';
    document.getElementById('target').value = 'completed'; // Remet le choix par défaut à 'Terminé'
    document.getElementById('priority').value = 'high'; // Remet le choix par défaut à 'Haute'
    document.getElementById('department').value = '';
    document.getElementById('result').value = '';
}

function deleteProject(project) {
    removeFromLocalStorage(project);
    loadProjects(); // Recharge les projets après suppression
}

function saveToLocalStorage(project) {
    let projects = JSON.parse(localStorage.getItem('projects')) || { Completed: [], Current: [], 'Near-term': [], Future: [] };
    projects[project.target].push(project);
    localStorage.setItem('projects', JSON.stringify(projects));
}

function removeFromLocalStorage(project) {
    let projects = JSON.parse(localStorage.getItem('projects')) || { Completed: [], Current: [], 'Near-term': [], Future: [] };
    const index = projects[project.target].findIndex(p => p.title === project.title);

    if (index !== -1) {
        projects[project.target].splice(index, 1);
        localStorage.setItem('projects', JSON.stringify(projects));
    }
}

function addToColumn(target, project) {
    const column = document.getElementById(target);
    const departmentText = {
        Completed: 'Completed',
        Current: 'Current',
        'Near-term': 'Near-term',
        Future: 'Future'
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

    const modifyButton = document.createElement('button');
    modifyButton.textContent = 'Edit';
    modifyButton.style.display = 'none';
    modifyButton.onclick = () => editProject(project);
    projectDiv.appendChild(modifyButton);

    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete';
    deleteButton.style.display = 'none';
    deleteButton.onclick = () => deleteProject(project);
    projectDiv.appendChild(deleteButton);

    column.appendChild(projectDiv);
}


function loadProjects() {
    clearColumns();
    const projects = JSON.parse(localStorage.getItem('projects')) || { Completed: [], Current: [], 'Near-term': [], Future: [] };

    for (const [target, projectList] of Object.entries(projects)) {
        projectList.forEach(project => {
            addToColumn(target, project);
        });
    }
}

function clearColumns() {
    const columns = document.querySelectorAll('.column');
    columns.forEach(column => {
        column.innerHTML = `<h2>${column.id}</h2>`;
    });
}

let isEditing = false;
let projectToEdit = null;

function editProject(project) {
    isEditing = true;
    projectToEdit = project;

    document.getElementById('title').value = project.title;
    document.getElementById('target').value = project.target;
    document.getElementById('priority').value = project.priority;
    document.getElementById('department').value = project.department;
    document.getElementById('result').value = project.result;

    projectForm.style.display = 'block';
}

function validateProject() {
    const title = document.getElementById('title').value;
    const target = document.getElementById('target').value;
    const priority = document.getElementById('priority').value;
    const department = document.getElementById('department').value;
    const result = document.getElementById('result').value;

    const project = { title, target, priority, department, result };

    if (isEditing) {
        // Mise à jour du projet existant
        removeFromLocalStorage(projectToEdit); // Supprimer l'ancienne version
        saveToLocalStorage(project); // Ajouter la version modifiée
        isEditing = false;
    } else {
        // Ajout d'un nouveau projet
        saveToLocalStorage(project);
    }

    clearForm();
    loadProjects();
    projectForm.style.display = 'none';
}
