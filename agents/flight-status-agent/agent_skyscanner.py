# Here we demonstrate how we can create a stock price agent that is compatible with DeltaV.

# After running this agent, it can be registered to DeltaV on Agentverse's Services tab. For registration you will have to use the agent's address. 
#
# third party modules used in this example
from pydantic import Field
import requests
from ai_engine import UAgentResponse, UAgentResponseType
import pickle

# To use this example, you will need to provide an API key for RapidAPI: https://rapidapi.com
# You can define your RAPIDAPI_API_KEY value in the .env file
# if RAPIDAPI_API_KEY == "YOUR_RAPIDAPI_API_KEY":
    # raise Exception("You need to provide an API key for RapidAPI to use this example")


class StockPriceRequest(Model):
    symbol: str = Field(description="The symbol of the share, for example: AAPL, GOOG, MSFT, etc.")
  
    class Config:
        allow_population_by_field_name = True

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


# Method that send the request to the endpoint which retrieves stock price for the specific share symbol
async def get_share_price(symbol: str):
    api_key = RAPIDAPI_API_KEY
    base_url = "https://apidojo-yahoo-finance-v1.p.rapidapi.com/market/v2/get-quotes"
    headers = {
        "X-RapidAPI-Host": "apidojo-yahoo-finance-v1.p.rapidapi.com",
        "X-RapidAPI-Key": api_key,
    }
    querystring = {"symbols": symbol}
    response = requests.get(base_url, headers=headers, params=querystring)
    data = response.json()
    try:
        price = data["quoteResponse"]["result"][0]["regularMarketPrice"]
        message = f"The current share price of {symbol} is {price}"
    except:
        message = f"Failed to retrieve share price for {symbol}"
    return message
  

yahoo_protocol = Protocol("StockPriceProtocol")

# Message handler for data requests sent to this agent
@yahoo_protocol.on_message(model=StockPriceRequest, replies={UAgentResponse})
async def yahoo_share(ctx: Context, sender: str, msg: StockPriceRequest):
    ctx.logger.info(f"Received message from {sender}, session: {ctx.session}")
    try:
        symbol = msg.symbol
        message = await get_share_price(symbol)
        ctx.logger.info(f"message from endpoint: {message}")
        await ctx.send(sender, UAgentResponse(message=message, type=UAgentResponseType.FINAL))
    except Exception as ex:
        ctx.logger.warn(ex)
        await ctx.send(sender, UAgentResponse(message=str(ex), type=UAgentResponseType.ERROR))

agent.include(yahoo_protocol, publish_manifest=True)
