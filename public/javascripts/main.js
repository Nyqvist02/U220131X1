'use-strict';

fetch('/data').then(res => res.json()).then(data => generateHtml(data));

const updateData = () =>{
    document.getElementById('spinner').classList.remove('d-none');
    const button = document.getElementById('reload');
    button.innerText = 'Detta kan ta tid';
    button.classList.remove('btn-danger');
    button.classList.add('btn-secondary');
    button.disabled = true;
    fetch('/data/update').then(x => location.reload());
}


const showText = (sender) => {
    const find = sender.target.id;

    const a = document.getElementById('A' + find);
    const b = document.getElementById('B' + find);
    if(a.style.display == 'none'){
        a.style.display = 'block';
        b.style.display = 'none';
        document.getElementById(find).innerText = 'Show More';
    }else {
        a.style.display = 'none';
        b.style.display = 'block';
        document.getElementById(find).innerText = 'Show Less';
    }
}

const generateHtml = (jobs) => {
    const container = document.getElementById('container');

    const titel = document.getElementById('titel');

    //Button div
    const buttonDiv = document.createElement('div');
    buttonDiv.id = 'button';
    buttonDiv.className = 'col-auto pb-2'

    //Button
    const button = document.createElement('button');
    button.className = 'btn btn-danger';
    button.id = 'reload';
    button.innerText = 'Uppdatera';

    //Spinner
    const spinner = document.createElement('div');
    spinner.className = 'spinner-border text-danger align-middle mx-2 d-none'
    spinner.role = 'status';
    spinner.id = 'spinner';

    document.getElementById('buttonRow').append(buttonDiv);
    buttonDiv.append(button);
    buttonDiv.append(spinner);

    button.addEventListener('click', updateData);

    jobs.forEach((job, counter) => {
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

        const button = document.createElement('button');
        button.className = 'btn btn-danger';
        button.innerText = 'Show More';
        button.id = counter;
        button.addEventListener('click', showText);

        const p2 = document.createElement('p');
        p2.className = 'card-text';
        p2.innerHTML = job.jobDescription.substring(0, 80);
        p2.id = 'A' + counter;

        const p3 = document.createElement('p');
        p3.className = 'card-text';
        p3.innerHTML = job.jobDescription;
        p3.style.display = 'none';
        p3.id = 'B' + counter;
    
        const a = document.createElement('a');
        a.className = 'text-danger'
        a.href = job.url;
        a.innerText = 'Arbetsförmedlingen';
    
        container.append(row);
        row.append(col);
        col.append(card);
        card.append(cardBody);
        cardBody.append(h3, h6, p1, button, p2, p3, a);
    })

    // const card = document.getElementById('card');

    // card.addEventListener('click', showText);

    titel.innerText = `Hittade ${jobs.length} jobb inom DevOps området`
}
