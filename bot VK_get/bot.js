const fs = require('fs');
const { VKApi, ConsoleLogger } = require('node-vk-sdk')
const token1 = 'vk1.a.ErwnlIGmU0lJKC1ZHLqAh35zzxpRSSz-iApCbwhwhVvJgnfE9DZA5M1UGT-Bn7gAGQwgT5bmASk-ZE09nNbCQJ9NjCU4Vz1f0tksmLt3A8q7538osE9r5PTU_HIhKcH2y_4KEvUPVACgF4TFKuEWk8orM-r0uD9QM2YbZUGaT2tM98gUW7Ujuxn-mY71AXhZQfyCNfCmFz5tNlchU8CuzQ'
const serviceKey = "cbd1a557cbd1a557cbd1a557fac8c436bdccbd1cbd1a557af2df0271cf1f9fc163446e5"


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
    .then(
        readerFile(adres)
    )
    .then(data => {
        writeToFile(JSON.stringify(data, null, 2), adres);
        return data
    })
    .then(dataFromInternet =>
        {getMembersIds(dataFromInternet)
        //console.log(getMembersIds(dataFromInternet))
        console.log(diff (getMembersIds(dataFromInternet), getMembersIds(dataFromFile)))
    }
    )
    

function writeToFile(data, adres) {
    fs.writeFileSync(adres, data, err => {
        if (err) {
            console.error(err);
        }
        // file written successfully
    })
}

function readerFile(adres){
    var fileReader = fs.readFileSync(adres).toString()
    return JSON.parse(fileReader)
    } catch(err){
        console.log('Ошибка чтения файла')
    }
}

var dataFromFile = readerFile(adres)//данные из файла

function getMembersIds(data){
    return data.response.items.map(item => item.id)
}

console.log(getMembersIds(dataFromFile))
//console.log(getMembersIds())


function diff (a, b) {

}