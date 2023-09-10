const fs = require('fs');
const { VKApi, ConsoleLogger } = require('node-vk-sdk')
const token1 = 'vk1.a.ErwnlIGmU0lJKC1ZHLqAh35zzxpRSSz-iApCbwhwhVvJgnfE9DZA5M1UGT-Bn7gAGQwgT5bmASk-ZE09nNbCQJ9NjCU4Vz1f0tksmLt3A8q7538osE9r5PTU_HIhKcH2y_4KEvUPVACgF4TFKuEWk8orM-r0uD9QM2YbZUGaT2tM98gUW7Ujuxn-mY71AXhZQfyCNfCmFz5tNlchU8CuzQ'
const serviceKey = "cbd1a557cbd1a557cbd1a557fac8c436bdccbd1cbd1a557af2df0271cf1f9fc163446e5"
//ввести данные.
const groupId = `tinkoffbank`;
const nameFile = `Подписчики группы ${groupId}.json`;
const adres = `c:\\Programming Project\\bot VK_get\\${nameFile}`;


fetch("https://api.vk.com/method/groups.getMembers", {
    "headers": {
        "content-type": "application/x-www-form-urlencoded",
        "accept": "*/*",
        "accept-language": "ru-RU,ru;q=0.9,en-GB;q=0.8,en;q=0.7,en-US;q=0.6",
    },
    "body": `group_id=${groupId}&access_token=${serviceKey}&v=5.131&fields=members_count`,
    "method": "POST"
})
    .then(response => response.json())
    .then(readerFile(adres))
    .then(data => {
        writeToFile(JSON.stringify(data, null, 2), adres);
        return data
    })
    .then(dataFromInternet => {
        getMembersIds(dataFromInternet)
        //console.log('данные из интернета:')
        //console.log(getMembersIds(dataFromInternet))//данные из интернета
        let noSubscribers = getMembersIds(dataFromFile).filter(x => !getMembersIds(dataFromInternet).includes(x));//отписались
        let subscribers = getMembersIds(dataFromInternet).filter(x => !getMembersIds(dataFromFile).includes(x));//подписались
        console.log(gettingResultsNoSubscribers(noSubscribers))
        console.log(gettingResultsSubscribers(subscribers))
    })

function writeToFile(data, adres) {
    fs.writeFileSync(adres, data, err => {
        if (err) {
            console.error(err);
        }
        // file written successfully
    })
}

function readerFile(adres) {
    var fileReader = fs.readFileSync(adres).toString()
    return JSON.parse(fileReader)
}

var dataFromFile = readerFile(adres)//данные из файла

function getMembersIds(data) {
    return data.response.items.map(item => item.id)
}

// console.log('данные из файла:')
// console.log(getMembersIds(dataFromFile))

function gettingResultsNoSubscribers(noSubscribers) {
    if (noSubscribers.length == 1) {
        return `Отписался: ${noSubscribers}`
    } else if (noSubscribers.length > 1) {
        return `Отписались: ${noSubscribers}`
    } else {
        return 'Новых отписавшихся нет'
    }
}

function gettingResultsSubscribers(subscribers) {
    if (subscribers.length == 1) {
        return `Подписался: ${subscribers}`
    } else if (subscribers.length > 1) {
        return `Подписались: ${subscribers}`
    } else {
        return 'Новых подписчиков нет'
    }
}