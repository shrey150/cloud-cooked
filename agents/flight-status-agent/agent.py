# Here we demonstrate how we can create a flight status agent that is compatible with DeltaV.

# After running this agent, it can be registered to DeltaV on Agentverse's Services tab. For registration you will have to use the agent's address. 
#
# third party modules used in this example
import os
import json
import pickle
from pydantic import Field, BaseModel
import requests

from superjsonmode.integrations.openai import StructuredOpenAIModel

import openai
import requests
from bs4 import BeautifulSoup

# dotenv
from dotenv import load_dotenv
load_dotenv()

GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")

# from ai_engine import UAgentResponse, UAgentResponseType

# class FlightStatusRequest(Model):
#     flight_number: str = Field(description="The flight number, for example: BA 222, AA 91, UA 123, AS 1234, WN 832 etc.")
  
#     class Config:
#         allow_population_by_field_name = True

# Method that send the request to the endpoint which retrieves flight status for the specific flight number
# def get_flight_status(flight_number: str):
#     base_url = "https://flight-radar1.p.rapidapi.com/flights/search"
#     headers = {
#         "X-RapidAPI-Host": "flight-radar1.p.rapidapi.com",
#         "X-RapidAPI-Key": "G6bYHK30oiOXfhSrzYlZjq913viftyRP",
#     }
#     querystring = {"query": flight_number}
#     response = requests.get(base_url, headers=headers, params=querystring)
#     data = response.json()
#     print(data)
#     results = data

#     schedule = None
#     live = None

#     for result in results:
#         if result["type"] == "schedule":
#             schedule = result
#         if result["type"] == "live":
#             live = result
            
#     try:
#         if live is not None:
#             message = f"{live['label']} is in the air from {live['detail']['schd_from']} to {live['detail']['schd_to']}"
#         elif schedule is not None:
#             message = f"The flight is scheduled with info {schedule}"
#         else:
#             message = "We couldn't find information for that flight."
#     except Exception as e:
#         message = f"Error while retrieving flight information for {flight_number}"
#     return message

# TODO could reactivate if needed
# def get_FAA_events():
#     base_url = "https://nasstatus.faa.gov/api/airport-events"
#     response = requests.get(base_url)
#     data = response.json()
#     print(data)
#     results = data

#     try:
#         print(results)
#     except Exception as e:
#         return "Error while retrieving FAA events."
#     return results

def get_airport_disruptions():
    base_url = "https://www.flightradar24.com/webapi/v1/airport-disruptions"
    response = requests.get(base_url)
    # print(response)
    data = response.json()
    # print(data)
    results = data["data"]["rank"]

    results = list(map(lambda x: {**x, "airport": x["airport"]["code"]["iata"]}, results))

    # make a dictionary of the results to get the airport code and the disruptions
    results = {result["airport"]: result for result in results}

    try:
        print(results)
    except Exception as e:
        return "Error while retrieving airport disruptions."
    return results

def find_safe_flight(src, dst):
    data = get_airport_disruptions()

    # TODO use later
    # faa = get_FAA_events()

    # get the arrival info for the src if it exists
    src_disruptions = data.get(src, None)
    dst_disruptions = data.get(dst, None)

    if src_disruptions is not None:
        src_disruptions = src_disruptions["arrivals"]

    if dst_disruptions is not None:
        dst_disruptions = dst_disruptions["departures"]

    # dump the data to a file
    with open('src_disruptions.json', 'w', encoding='utf8') as f:
        json.dump(src_disruptions, f, indent=4)

    with open('dst_disruptions.json', 'w', encoding='utf8') as f:
        json.dump(dst_disruptions, f, indent=4)

    return src_disruptions, dst_disruptions

def get_nearest_airports(location):
    # model = StructuredOpenAIModel()
    # class Airports(BaseModel):
    #     data: list[str]

    # Provide context to GPT-4 abstr[]he location and ask for the nearest airports
    prompt = f"Given the IATA airport code {location}, list all medium and large size airports within 100 miles with their IATA area code and their approximate distances. Ensure that all IATA codes are accurate."

    prompt_template = f"{prompt} Format your answer as a JSON object with the following structure: {{" \
        f"\"data\": [{{\"iata\": \"JFK\", \"distance_in_miles\": 10}}, {{\"iata\": \"LGA\", \"distance_in_miles\": 20}}]}}"
    
    # output = model.generate(
    #     prompt,
    #     extraction_prompt_template=prompt_template,
    #     schema=Airports,
    #     batch_size=5,
    #     stop=["\n\n"],
    #     temperature=0,
    # )
    openai.api_key = OPENAI_API_KEY
    response = openai.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=[{"role": "user", "content": prompt_template}],
    )

    return response.choices[0].message.content

def scrape_airport_codes(carrier_code, flight_number):
    url = f"https://www.flightview.com/flight-tracker/{carrier_code}/{flight_number}"
    response = requests.get(url)

    # Check if the request was successful
    if response.status_code == 200:
        soup = BeautifulSoup(response.text, 'html.parser')
        airport_codes = soup.find_all(class_='airport-header-code')

        # Extracting the text content from each tag
        return [code.get_text().strip() for code in airport_codes]
    else:
        print("Failed to retrieve the webpage")
        return None  

# def streamline_api_response(api_response):
#     streamlined_data = []

#     if 'content' not in api_response:
#         return streamlined_data
    
#     # Iterate through each itinerary
#     for itinerary_id, itinerary_details in api_response['content']['results']['itineraries'].items():
#         itinerary_info = {
#             "itinerary_id": itinerary_id,
#             "pricing_options": [],
#             "legs": []
#         }

#         # Add pricing options
#         for option in itinerary_details['pricingOptions']:
#             pricing_option = {
#                 "price": option['price']['amount'],
#                 "agent_ids": option['agentIds']
#             }
#             itinerary_info['pricing_options'].append(pricing_option)

#         # Add leg details
#         for leg_id in itinerary_details['legIds']:
#             leg = api_response['content']['legs'][leg_id]
#             leg_info = {
#                 "leg_id": leg_id,
#                 "origin": leg['originPlaceId'],
#                 "destination": leg['destinationPlaceId'],
#                 "departure": f"{leg['departureDateTime']['year']}-{leg['departureDateTime']['month']:02d}-{leg['departureDateTime']['day']:02d} {leg['departureDateTime']['hour']:02d}:{leg['departureDateTime']['minute']:02d}",
#                 "arrival": f"{leg['arrivalDateTime']['year']}-{leg['arrivalDateTime']['month']:02d}-{leg['arrivalDateTime']['day']:02d} {leg['arrivalDateTime']['hour']:02d}:{leg['arrivalDateTime']['minute']:02d}",
#                 "duration_minutes": leg['durationInMinutes'],
#                 "stop_count": leg['stopCount']
#             }
#             itinerary_info['legs'].append(leg_info)

#         streamlined_data.append(itinerary_info)

#     return streamlined_data

def find_flights(codes, anchor):
    # Assuming codes and anchor in IATA format
    for code in codes:
        # print(code, codes, anchor)
        url = 'https://partners.api.skyscanner.net/apiservices/v3/flights/live/search/create'
        headers = {'x-api-key': 'sh428739766321522266746152871799'}
        data = {
            "query": {
                "market": "US",
                "locale": "en-US",
                "currency": "USD",
                "query_legs": [
                    {
                        "origin_place_id": {"iata": code},
                        "destination_place_id": {"iata": anchor},
                        "date": {"year": 2024, "month": 2, "day": 18}
                    }
                ],
                "adults": 1,
                "cabin_class": "CABIN_CLASS_ECONOMY"
            }
        }

        res = requests.post(url, headers=headers, json=data, timeout=5)
        session_token = res.json()
        print(session_token)
        try:
            session_token = session_token['sessionToken']
            with open('session_token.pkl', 'wb') as f:
                pickle.dump(session_token, f)
        except KeyError:
            # load the session_token from a pickle file if None
            with open('session_token.pkl', 'rb') as f:
                try:
                    session_token = pickle.load(f)
                except FileNotFoundError:
                    session_token = "Default session token"

        url = f'https://partners.api.skyscanner.net/apiservices/v3/flights/live/search/poll/{session_token}'
        headers = {'x-api-key': 'sh428739766321522266746152871799'}
        streamlined_response = requests.post(url, headers=headers, timeout=5)

        # Process the response to extract essential information
        # streamlined_response = streamline_api_response(response.json())

        # Save the streamlined response to a file with unique name
        with open(f'streamlined_flights_{code}_{anchor}.json', 'w', encoding='utf8') as f:
            json.dump(streamlined_response, f, indent=4)

        print(streamlined_response)
# flightradar_protocol = Protocol("FlightStatusProtocol")

# # Message handler for data requests sent to this agent
# @flightradar_protocol.on_message(model=FlightStatusRequest, replies={UAgentResponse})
# async def flightradar_status(ctx: Context, sender: str, msg: FlightStatusRequest):
#     ctx.logger.info(f"Received message from {sender}, session: {ctx.session}")
#     try:
#         flight_number = msg.flight_number
#         message = await get_flight_status(flight_number)
#         ctx.logger.info(f"message from endpoint: {message}")
#         await ctx.send(sender, UAgentResponse(message=message, type=UAgentResponseType.FINAL))
#     except Exception as ex:
#         ctx.logger.warn(ex)
#         await ctx.send(sender, UAgentResponse(message=str(ex), type=UAgentResponseType.ERROR))

# agent.include(flightradar_protocol, publish_manifest=True)

# def main():
#     # print(get_flight_status("AA 91"))
#     print(get_airport_events())

# main()

# get_airport_disruptions()

# Example usage
flight_code = "AA6271"
carrier_code = flight_code[:2]
flight_number = flight_code[2:]

print("Flight code:", flight_code)
print("Carrier code:", carrier_code)
print("Flight number:", flight_number)

[src, dst] = scrape_airport_codes(carrier_code, flight_number)

print("Source airport:", src)
print("Destination airport:", dst)

nearest_airports = get_nearest_airports(src)

# parse JSON response
nearest_airports = json.loads(nearest_airports)['data']
nearest_airports = list(filter(lambda x: x['iata'] != src, nearest_airports))
nearest_airports = sorted(nearest_airports, key=lambda x: x['distance_in_miles'])

# get the nearest airports IATA codes
# filter out airport with IATA same as src
nearest_airports = [airport['iata'] for airport in nearest_airports]

print("Nearest airports:", nearest_airports)

print(find_safe_flight(src, dst))

print(find_flights(nearest_airports, dst))


print(nearest_airports)