'use-strict';

fetch('./data/data.json').then(res => res.json()).then(data => generateHtml(data));

const container = document.getElementById('container');

const titel = document.getElementById('titel');

const generateHtml = (jobs) => {
    jobs.forEach(job => {
        const row = document.createElement('div');
        row.className = 'row justify-content-evenly';
    
        const col = document.createElement('div');
        col.className = 'pb-2 col-5';
    
        const card = document.createElement('div');
        card.className = 'card border border-danger border-5';
    
        const cardBody = document.createElement('div');
        cardBody.className = 'card-body';
    
        const h3 = document.createElement('h3');
        h3.className = 'card-title';
        h3.innerText = job.companyName;
    
        const h6 = document.createElement('h6');
        h6.className = 'card-text';
        h6.innerText = job.jobTitle;
    
        const p1 = document.createElement('p');
        p1.className = 'card-text text-secondary';
        p1.innerText = job.companyLocation;
    
        const p2 = document.createElement('p');
        p2.className = 'card-text';
        p2.innerText = job.jobDescription;
    
        const a = document.createElement('a');
        a.className = 'text-danger'
        a.href = job.url;
        a.innerText = 'Läs mer';
    
        container.append(row);
        row.append(col);
        col.append(card);
        card.append(cardBody);
        cardBody.append(h3, h6, p1, p2, a);
    })

    titel.innerText = `Hittade ${jobs.length} jobb inom DevOps området`
}
