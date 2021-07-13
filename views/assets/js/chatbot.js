const getResponse = async (x) => {
    var response = await fetch(`https://covidbot-api.herokuapp.com/?q=${x}`, {mode:'cors'})
    response = response.json()
    return response
}

const getNews = async () => {
    var response = await fetch(`https://covid19-tracker-abhay.herokuapp.com/Api/getNews`, {mode:'cors'})
    response = response.json()
    return response
}

const getVaccineStats = async () => {
    var response = await fetch(`https://api.cowin.gov.in/api/v1/reports/v2/getVacPublicReports`)
    response = response.json()
    return response
}

function vaccineStatsFormat(data) {
    let last2Days = data.last30DaysVaccination.splice((data.last30DaysVaccination).length - 2, 2);
    let temp = ''
    temp += `--- ${last2Days[1].vaccine_date} ---`
    temp += `<br>Dose 1: ${last2Days[1].dose_1}<br>`
    temp += `Dose 2: ${last2Days[1].dose_2}<br>`
    temp += `Urban: ${last2Days[1].urban}<br>`
    temp += `Rural: ${last2Days[1].rural}<br>`
    temp += `Total: ${last2Days[1].total}<br><br>`

    temp += `--- ${last2Days[0].vaccine_date} ---`
    temp += `<br>Dose 1: ${last2Days[0].dose_1}<br>`
    temp += `Dose 2: ${last2Days[0].dose_2}<br>`
    temp += `Urban: ${last2Days[0].urban}<br>`
    temp += `Rural: ${last2Days[0].rural}<br>`
    temp += `Total: ${last2Days[0].total}`
    
    return temp
}

function giveFormattedMsg(e) {
    let temp = ''
    temp += '--- World ---'
    temp += `<br>World Total: ${e.world_total}<br>`
    temp += `World New: ${e.world_new}<br>`
    temp += `World Active: ${e.world_active}<br>`
    temp += `World Death: ${e.world_death}<br>`
    temp += `World New Death: ${e.world_new_death}<br><br>`

    temp += '--- India ---'
    temp += `<br>India Total: ${e.india_total}<br>`
    temp += `India New: ${e.india_new}<br>`
    temp += `India Active: ${e.india_active}<br>`
    temp += `India Death: ${e.india_death}<br>`
    temp += `India New Death: ${e.india_new_death}`

    return temp
}

// Chat PopUp
var element = $('.floating-chat');

setTimeout(function() {
    element.addClass('enter');
}, 1000);

element.click(openElement);

function openElement() {
    var messages = element.find('.messages');
    var textInput = element.find('.text-box');
    element.find('>i').hide();
    element.addClass('expand');
    element.find('.chat').addClass('enter');
    var strLength = textInput.val().length * 2;
    textInput.keydown(onMetaAndEnter).prop("disabled", false).focus();
    element.off('click', openElement);
    element.find('.header button').click(closeElement);
    element.find('#sendMessage').click(sendNewMessage);
    messages.scrollTop(messages.prop("scrollHeight"));
}

function closeElement() {
    element.find('.chat').removeClass('enter').hide();
    element.find('>i').show();
    element.removeClass('expand');
    element.find('.header button').off('click', closeElement);
    element.find('#sendMessage').off('click', sendNewMessage);
    element.find('.text-box').off('keydown', onMetaAndEnter).prop("disabled", true).blur();
    setTimeout(function() {
        element.find('.chat').removeClass('enter').show()
        element.click(openElement);
    }, 500);
}

function receiveNewMessage(data) {
    if (!data) return;

    var messagesContainer = $('.messages');

    messagesContainer.append([
        '<li class="self">', data, '</li>'
    ].join(''));

    messagesContainer.finish().animate({
        scrollTop: messagesContainer.prop("scrollHeight")
    }, 250);
}

function sendNewMessage() {
    var userInput = $('.text-box');
    var newMessage = userInput.html().replace(/\<div\>|\<br.*?\>/ig, '\n').replace(/\<\/div\>/g, '').trim().replace(/\n/g, '<br>');
    if (!newMessage) return;

    getResponse(newMessage).then(data => {
        if(data.data == 'https://covid19-tracker-abhay.herokuapp.com/Api/getNews') {
            getNews().then(data => {
                for(let i=0; i<data.length; ++i) {
                    let temp = ''
                    temp += data[i].title
                    temp += `<br><br><a href="${data[i].uri}" target="_blank">Link</a><br>`
                    temp += `Time: ${data[i].time}`
                    receiveNewMessage(temp);
                }
            })
        }
        else if(data.data == 'case_stats') {
            socket.emit("bot_data_request");
            socket.on("bot_data_answer", (e) => {
                receiveNewMessage(e.data);
            })
        }
        else if(data.data == 'Vaccination_stats') {
            getVaccineStats().then(data => {
                receiveNewMessage(vaccineStatsFormat(data))
            }) 
        }
        else {
            receiveNewMessage(data.data);
        }
    }).catch((e) => {
        receiveNewMessage("Sorry, I am unable to serve at this moment.");
    })

    var messagesContainer = $('.messages');

    messagesContainer.append([
        '<li class="other">',
        newMessage,
        '</li>'
    ].join(''));

    // clean out old message
    userInput.html('');
    // focus on input
    userInput.focus();

    messagesContainer.finish().animate({
        scrollTop: messagesContainer.prop("scrollHeight")
    }, 250);
}

function onMetaAndEnter(event) {
    if ((event.metaKey || event.ctrlKey) && event.keyCode == 13) {
        sendNewMessage();
    }
}