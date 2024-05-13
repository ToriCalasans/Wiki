document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('form');
    const tbody = document.getElementById('tbody');
    const nameInput = document.getElementById('name');
    const table = document.getElementById('table');
    const generateFileBtn = document.getElementById('generateFileBtn');
    const relationshipModal = new bootstrap.Modal(document.getElementById('relationshipModal'));

    let selectedPerson;
    let people = [];
    let selectedCharacter = '';

    function addPerson(name) {
        const person = { name, relationship: '' };
        people.push(person);
        updateTable();
        updateSelectRelative();
        saveLocally();
    }
    function loadLocally() {
        const savedData = localStorage.getItem('people');
        if (savedData) {
            people = JSON.parse(savedData);
            updateTable();
            updateSelectRelative();
        }
    }
    function saveLocally() {
        localStorage.setItem('people', JSON.stringify(people));
    }
    function updateTable() {
        tbody.innerHTML = '';
        people.forEach(person => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td class="name" data-name="${person.name}">${person.name}</td>
                <td>${person.relationship}</td>
                <td><button data-name="${person.name}" class="addRelationshipBtn btn btn-primary">Add Relationship</button></td>
            `;
            tbody.appendChild(tr);
        });
    }
    function updateSelectRelative() {
        const relativeSelect = document.getElementById('relativeSelect');
        if (!relativeSelect) return;
        relativeSelect.innerHTML = '';
        people.forEach(p => {
            if (!selectedPerson || p.name !== selectedPerson.name) {
                const option = document.createElement('option');
                option.textContent = p.name;
                relativeSelect.appendChild(option);
            }
        });
    }
    function updateSelectCharacter() {
        const selectCharacter = document.getElementById('selectCharacter');
        if (!selectCharacter) return;
        selectCharacter.innerHTML = '';
        people.forEach(p => {
            const option = document.createElement('option');
            option.textContent = p.name;
            selectCharacter.appendChild(option);
        });
    }
    form.addEventListener('submit', function (event) {
        event.preventDefault();
        const name = nameInput.value;
        addPerson(name);
        form.reset();
    });
    table.addEventListener('click', function (event) {
        if (event.target.classList.contains('addRelationshipBtn')) {
            const selectedName = event.target.dataset.name;
            selectedPerson = people.find(p => p.name === selectedName);
            updateSelectRelative();
            updateSelectCharacter();
            relationshipModal.show();
        }
    });
    document.getElementById('saveRelationship').addEventListener('click', function () {
        const relativeSelect = document.getElementById('relativeSelect');
        const relationshipSelect = document.getElementById('relationshipSelect');
        const selectedRelative = relativeSelect.value;
        const selectedRelationship = relationshipSelect.value;

        const relativePerson = people.find(p => p.name === selectedRelative);
        if (relativePerson) {
            relativePerson.relationship = `${selectedRelationship} of ${selectedPerson.name}`;
            updateTable();
            saveLocally();
        }

        relationshipModal.hide();
    });
    generateFileBtn.addEventListener('click', function () {
        const selectCharacter = document.getElementById('selectCharacter');
        const selectedCharacter = selectCharacter.value;

        let data;
        if (selectedCharacter) {
            data = people
                .filter(p => p.relationship.includes(selectedCharacter))
                .map(p => {
                    const relationshipIndex = p.relationship.indexOf('(');
                    const relationship = relationshipIndex !== -1 ? p.relationship.slice(relationshipIndex + 1, -1).trim() : '';
                    return `${p.name} (${relationship})`;
                })
                .join('\n');
        } else {
            data = people
                .map(p => {
                    const relationshipIndex = p.relationship.indexOf('(');
                    const relationship = relationshipIndex !== -1 ? p.relationship.slice(relationshipIndex + 1, -1).trim() : '';
                    return `${p.name} (${relationship})`;
                })
                .join('\n');
        }

        const blob = new Blob([data], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'genealogical_tree.txt';
        document.body.appendChild(a);
        a.click();
        URL.revokeObjectURL(url);
        document.body.removeChild(a);
    });
    loadLocally();
    updateSelectCharacter();
});
