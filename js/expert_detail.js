
document.addEventListener("DOMContentLoaded", function() {
    const queryParams = new URLSearchParams(window.location.search);
    var expertId = queryParams.get('id');

    if (expertId) {
        fetchAndRenderExpertsDetails(expertId);
    } else {
        console.error("No expert ID provided in the URL");
    }
});

async function fetchAndRenderExpertsDetails(expertId) {
    const expertsDetail = await fetchMdDetails(expertId);
    const expertsDetailScore = await fetchMdDetailsScore(expertId);
    renderMdDetails(expertsDetail, expertsDetailScore);
  }
  
async function fetchMdDetails(expertId) {
    try {
        const url = `http://43.201.79.49/mds/${expertId}`; 
        const response = await fetch(url, {
            method: 'GET',
        });

        if (!response.ok) {
            throw new Error(`Network response was not ok (${response.status})`);
        }

        const result = await response.json();
        console.log('Response data:', result.data);
        return result.data; 
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

async function fetchMdDetailsScore(expertId) {
    try {
        const url = `http://43.201.79.49/mds/${expertId}/score`; 
        const response = await fetch(url, {
            method: 'GET',
        });

        if (!response.ok) {
            throw new Error(`Network response was not ok (${response.status})`);
        }

        const result2 = await response.json();
        console.log('Response data2:', result2.data);
        return result2.data;  
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}


async function renderMdDetails(expertsDetail, expertsDetailScore) {
    
    try {
        const nameElement = document.querySelector('.top .item p:first-child');
        const totalAvgScore = expertsDetailScore.avgScore % 1 === 0 ? expertsDetailScore.avgScore + '.0' : expertsDetailScore.avgScore;
        nameElement.innerHTML = expertsDetail.name + '<img src="./img/common/star.svg" alt="star"><span>' + totalAvgScore + '</span><span>(' + expertsDetailScore.total + ')</span>';

        // const nameElement = document.querySelector('.top .item p:first-child');
        // nameElement.innerHTML = expertsDetail.name + '<img src="./img/common/star.svg" alt="star"><span>' + expertsDetailScore.avgScore + '</span><span>('+ expertsDetailScore.total +')</span>';

        const jobElement = document.querySelector('.top .item p:nth-child(2)');
        jobElement.innerHTML = `${expertsDetail.job}<br>${expertsDetail.career}`;

        const introductionTitleElement = document.querySelector('.introduction h2 span');
        introductionTitleElement.textContent = expertsDetail.name;

        const introductionItems = document.querySelectorAll('.introduction .wrap_item .item span:nth-of-type(1)');
        introductionItems[0].textContent = expertsDetail.field;
        introductionItems[2].textContent = expertsDetail.subject;
        introductionItems[3].textContent = expertsDetail.characteristic;

        const careerElement = document.querySelector('.wrap02 h3');
        careerElement.textContent = expertsDetail.career;

        const descriptionElement = document.querySelector('.wrap02 p');
        descriptionElement.textContent = expertsDetail.description;

        const consultingButtons = document.querySelectorAll('.wrap03 button');
        consultingButtons[0].textContent = expertsDetail.consulting[0];
        consultingButtons[1].textContent = expertsDetail.consulting[1];
        consultingButtons[2].textContent = expertsDetail.consulting[2];

        const meetingScheduleElement = document.querySelector('.wrap04 p');
        meetingScheduleElement.textContent = expertsDetail.meetingSchedule;
    } catch (error) {
        console.error('Error rendering data:', error);
    }
}

