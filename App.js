import { initializeApp } from 'firebase/app';
import {
  getFirestore, collection, addDoc, getDocs, updateDoc, doc
} from 'firebase/firestore';

const firebaseConfig = {
  // your Firebase config here
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

let goals = [];

const input = document.getElementById('new-goal');
const list = document.getElementById('goal-list');
const diagramDiv = document.getElementById('diagram');

const fetchGoals = async () => {
  const snapshot = await getDocs(collection(db, 'goals'));
  goals = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  renderGoals();
  updateDiagram();
};

const addGoal = async () => {
  const newGoal = input.value.trim();
  if (!newGoal) return;

  const docRef = await addDoc(collection(db, 'goals'), {
    title: newGoal,
    completed: false
  });

  goals.push({ id: docRef.id, title: newGoal, completed: false });
  input.value = '';
  renderGoals();
  updateDiagram();
};

const toggleComplete = async (goal) => {
  await updateDoc(doc(db, 'goals', goal.id), { completed: !goal.completed });
  goal.completed = !goal.completed;
  renderGoals();
  updateDiagram();
};

const renderGoals = () => {
  list.innerHTML = '';
  goals.forEach((goal) => {
    const li = document.createElement('li');
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = goal.completed;
    checkbox.onchange = () => toggleComplete(goal);

    const span = document.createElement('span');
    span.textContent = goal.title;
    if (goal.completed) span.classList.add('completed');

    li.appendChild(checkbox);
    li.appendChild(span);
    list.appendChild(li);
  });
};

const updateDiagram = () => {
  let diagram = 'graph TD\n';
  goals.forEach((g, i) => {
    diagram += `G${i}[${g.completed ? '✔️ ' : ''}${g.title}]\n`;
    if (i > 0) diagram += `G${i - 1} --> G${i}\n`;
  });
  diagramDiv.innerHTML = diagram;
  mermaid.init(undefined, diagramDiv);
};

window.addGoal = addGoal;
fetchGoals();
