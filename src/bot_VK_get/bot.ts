var fs = require('fs');
import { serviceKey } from '../serviceKey/vkKey';

export async function getNewGroupMembersData(groupId: string): Promise<string> {
    return fetch("https://api.vk.com/method/groups.getMembers", {
        "headers": {
            "content-type": "application/x-www-form-urlencoded",
            "accept": "*/*",
            "accept-language": "ru-RU,ru;q=0.9,en-GB;q=0.8,en;q=0.7,en-US;q=0.6",
        },
        "body": `group_id=${groupId}&access_token=${serviceKey}&v=5.131&fields=members_count`,
        "method": "POST"
    })
        .then(response => response.json())
        .then(data => JSON.stringify(data))
}

export async function getCommunityName(groupId: string): Promise<string | void> {
    return fetch("https://api.vk.com/method/groups.getById", {
        "headers": {
            "content-type": "application/x-www-form-urlencoded",
            "accept": "*/*",
            "accept-language": "ru-RU,ru;q=0.9,en-GB;q=0.8,en;q=0.7,en-US;q=0.6",
        },
        "body": `group_id=${groupId}&access_token=${serviceKey}&v=5.131&fields=members_count`,
        "method": "POST"
    })
        .then(response => response.json())
        .then(data => {
            const communityName = data.response[0].name;
            return `${communityName}`;
          })
          .catch(error => {
            console.error('Error:', error);
          });
}