const fs = require('fs');
const { VKApi, ConsoleLogger } = require('node-vk-sdk')
const token1 = 'vk1.a.ErwnlIGmU0lJKC1ZHLqAh35zzxpRSSz-iApCbwhwhVvJgnfE9DZA5M1UGT-Bn7gAGQwgT5bmASk-ZE09nNbCQJ9NjCU4Vz1f0tksmLt3A8q7538osE9r5PTU_HIhKcH2y_4KEvUPVACgF4TFKuEWk8orM-r0uD9QM2YbZUGaT2tM98gUW7Ujuxn-mY71AXhZQfyCNfCmFz5tNlchU8CuzQ'
const serviceKey = "cbd1a557cbd1a557cbd1a557fac8c436bdccbd1cbd1a557af2df0271cf1f9fc163446e5"
//ввести данные.
const groupId = `mikannoyuki`;
const nameFile = `Подписчики группы ${groupId}.json`;
const adres = `c:\\Programming Project\\bot VK_get\\${nameFile}`;

f1()
async function f1() {
    let t = await fetch("https://api.vk.com/method/groups.getMembers", {
        "headers": {
            "content-type": "application/x-www-form-urlencoded",
            "accept": "*/*",
            "accept-language": "ru-RU,ru;q=0.9,en-GB;q=0.8,en;q=0.7,en-US;q=0.6",
        },
        "body": `group_id=${groupId}&access_token=${serviceKey}&v=5.131&fields=members_count`,
        "method": "POST"
    })
    let t1 = await t.json()
    let t2 = await writingDefaultFileText(nameFile, t1)
    let t3 = setTimeout(readerFile, 2000,adres)
    let t4 = await writeToFile(JSON.stringify(t1, null, 2), adres)
    let t5 = await getMembersIds(t4)
    let t6 = await f2(dataFromFile, t5)

}

async function writingDefaultFileText(nameFile, t1) {
//     const defaultFileText = `{
//     "response": {
//       "count": 1,
//       "items": [
//       ]
//     }
//   }`
    fs.access(`${adres}`, function (error) {
        if (error) {
            writeToFile(JSON.stringify(t1, null, 2), adres)
        }else{
            console.log('Файл на месте')
        }
    });
}
async function readerFile(adres) {
    try{
    var fileReader = fs.readFileSync(adres).toString()
    console.log(JSON.parse(fileReader))
    } catch(err){
        console.log(err)
        console.log('Ошибка чтения файла')
    }
}
var dataFromFile = readerFile(adres)//данные из файла
async function writeToFile(data, adres) {
    fs.writeFileSync(adres, data, err => {
        if (err) {
            console.error(err);
        }
        // file written successfully
    })
}
async function getMembersIds(data) {
    try{
    return data.response.items.map(item => item.id)
    }catch{
        console.log('Ошибка данных из интернета')
    }
}
async function gettingResultsNoSubscribers(noSubscribers) {
    if (noSubscribers.length == 1) {
        return `Отписался: ${noSubscribers}`
    } else if (noSubscribers.length > 1) {
        return `Отписались: ${noSubscribers}`
    } else {
        return 'Новых отписавшихся нет'
    }
}
async function gettingResultsSubscribers(subscribers) {
    if (subscribers.length == 1) {
        return `Подписался: ${subscribers}`
    } else if (subscribers.length > 1) {
        return `Подписались: ${subscribers}`
    } else {
        return 'Новых подписчиков нет'
    }
}
async function f2(dataFromFile, dataFromInternet) {
    let noSubscribers = getMembersIds(dataFromFile).filter(x => !getMembersIds(dataFromInternet).includes(x));//отписались
    let subscribers = getMembersIds(dataFromInternet).filter(x => !getMembersIds(dataFromFile).includes(x));//подписались
    console.log(gettingResultsNoSubscribers(noSubscribers))
    console.log(gettingResultsSubscribers(subscribers))
}