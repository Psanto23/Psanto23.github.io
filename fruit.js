const pollData = {
  apple: 0,
  banana: 0,
  orange: 0,
  strawberry: 0,
  grape: 0
};

const optionLabels = {
  apple: 'Apple',
  banana: 'Banana',
  orange: 'Orange',
  strawberry: 'Strawberry',
  grape: 'Grape'

};

const hasVoted = localStorage.getItem('pollVoted');

function renderResults() {
  const chartBars = document.getElementById('chartBars');
  const statsBody = document.getElementById('statsBody');
  const totalVotesDiv = document.getElementById('totalVotes');
  const yAxis = document.getElementById('yAxis');
  const total = Object.values(pollData).reduce((a, b) => a + b, 0);
  
  const maxVotes = Math.max(...Object.values(pollData), 1);
  
  // Create Y-axis labels
  yAxis.innerHTML = '';
  for (let i = maxVotes; i >= 0; i -= Math.ceil(maxVotes / 5)) {
    const label = document.createElement('div');
    label.className = 'y-label';
    label.textContent = i;
    yAxis.appendChild(label);
  }
  
  // Create bars
  chartBars.innerHTML = '';
  statsBody.innerHTML = '';
  
  Object.keys(pollData).forEach(key => {
    const votes = pollData[key];
    const percentage = total > 0 ? Math.round((votes / total) * 100) : 0;
    const height = maxVotes > 0 ? (votes / maxVotes) * 100 : 0;
    
    // Create bar
    const barWrapper = document.createElement('div');
    barWrapper.className = 'bar-wrapper';
    
    const bar = document.createElement('div');
    bar.className = 'bar-column';
    bar.style.height = height + '%';
    bar.innerHTML = `<span class="bar-value">${votes}</span>`;
    
    const label = document.createElement('div');
    label.className = 'bar-label';
    label.textContent = optionLabels[key];
    
    barWrapper.appendChild(bar);
    barWrapper.appendChild(label);
    chartBars.appendChild(barWrapper);
    
    // Create table row
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${optionLabels[key]}</td>
      <td>${votes}</td>
      <td>${percentage}%</td>
    `;
    statsBody.appendChild(row);
  });

  totalVotesDiv.textContent = `Total Votes: ${total}`;
  document.getElementById('results').classList.add('show');
}

function vote(option) {
  if (hasVoted) return;
  
  pollData[option]++;
  localStorage.setItem('pollVoted', 'true');
  
  document.querySelectorAll('.option').forEach(opt => {
    opt.classList.add('disabled');
  });
  
  document.getElementById('votedMsg').classList.add('show');
  renderResults();
}

// Initialize
if (hasVoted) {
  document.querySelectorAll('.option').forEach(opt => {
    opt.classList.add('disabled');
  });
  document.getElementById('votedMsg').classList.add('show');
  renderResults();
}

// Add click listeners
document.querySelectorAll('.option').forEach(option => {
  option.addEventListener('click', function() {
    if (!hasVoted) {
      const choice = this.getAttribute('data-option');
      vote(choice);
    }
  });
});