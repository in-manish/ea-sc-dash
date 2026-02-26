curl 'https://reconnect.eventapp-reconnect.fairfest.in/events/22/category_types/emails/' \
  -H 'Accept: application/json, text/plain, */*' \
  -H 'Accept-Language: en-US,en;q=0.9,hi;q=0.8' \
  -H 'Authorization: Token <token>' \
  -H 'Connection: keep-alive' \
  -H 'Origin: https://reconnect.fairfest.in' \
  -H 'Referer: https://reconnect.fairfest.in/' \
  -H 'Sec-Fetch-Dest: empty' \
  -H 'Sec-Fetch-Mode: cors' \
  -H 'Sec-Fetch-Site: same-site' \
  -H 'User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36' \
  -H 'sec-ch-ua: "Not:A-Brand";v="99", "Google Chrome";v="145", "Chromium";v="145"' \
  -H 'sec-ch-ua-mobile: ?0' \
  -H 'sec-ch-ua-platform: "macOS"'

  response:
  [
    {
        "id": 
        "event_id": 
        "category_name": 
        "email_name": ""
        "email": ""
        "subject": ""
        "sms_name": ""
        "sms": ""
    }
  ]

# styling guide
- integration ui must align with existing ui.
- color palette must align with existing ui.
- use existing styling pattern
- use appropriate icons from lucide-react
- 
# inegration guide
integrate above under comunication->along with whatsapp tab.
on click email preview must display, give option to preview email.


##### EDIT EMAIL-
curl --location --request PUT 'https://reconnect.stage-eventapp-reconnect.fairfest.in/events/9/category_types/emails/12/' \
--header 'Accept: application/json, text/plain, */*' \
--header 'Accept-Language: en-US,en;q=0.9,hi;q=0.8' \
--header 'Authorization: Token 7f22575a9193f41b889054635a53965dea86feeb' \
--header 'Connection: keep-alive' \
--header 'Content-Type: application/json;charset=UTF-8' \
--header 'Origin: https://stage-reconnect.fairfest.in' \
--header 'Referer: https://stage-reconnect.fairfest.in/' \
--header 'Sec-Fetch-Dest: empty' \
--header 'Sec-Fetch-Mode: cors' \
--header 'Sec-Fetch-Site: same-site' \
--header 'User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36' \
--header 'sec-ch-ua: "Not:A-Brand";v="99", "Google Chrome";v="145", "Chromium";v="145"' \
--header 'sec-ch-ua-mobile: ?0' \
--header 'sec-ch-ua-platform: "macOS"' \
--data '{
    "id": "12",
    "event_id": 9,
    "category_name": "general",
    "email_name": "POC Email Template(Test)",
    "email": "",
    "subject": "Welcome to OTM 2026 – Exhibitor Portal POC(Test)",
    "sms_name": null,
    "sms": null
}'
response:
{
    "id": 12,
    "event_id": 9,
    "category_name": "general",
    "email_name": "POC Email Template(Test)",
    "email": "",
    "subject": "Welcome to OTM 2026 – Exhibitor Portal POC(Test)",
    "sms_name": null,
    "sms": null
}

- add edit api integration