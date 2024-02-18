# Here we demonstrate how we can create a stock price agent that is compatible with DeltaV.

# After running this agent, it can be registered to DeltaV on Agentverse's Services tab. For registration you will have to use the agent's address. 
#
# third party modules used in this example
import os
import json
from pydantic import Field, BaseModel
import requests

from superjsonmode.integrations.openai import StructuredOpenAIModel

import openai
import requests
from bs4 import BeautifulSoup

# dotenv
from dotenv import load_dotenv
load_dotenv()
from ai_engine import UAgentResponse, UAgentResponseType

# To use this example, you will need to provide an API key for RapidAPI: https://rapidapi.com
# You can define your RAPIDAPI_API_KEY value in the .env file
if RAPIDAPI_API_KEY == "YOUR_RAPIDAPI_API_KEY":
    raise Exception("You need to provide an API key for RapidAPI to use this example")


class AirportCodes(Model):
    carrier_code: str = Field(description="The carrier code, for example: BA, AA, UA, AS, WN etc.")
    flight_number: str = Field(description="The flight number, for example: 222, 91, 123, 1234, 832 etc.")


# Method that send the request to the endpoint which retrieves stock price for the specific share symbol
async def scrape_airport_codes(carrier_code, flight_number):
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
  

yahoo_protocol = Protocol("StockPriceProtocol")

# Message handler for data requests sent to this agent
@yahoo_protocol.on_message(model= AirportCodes, replies={UAgentResponse})
async def yahoo_share(ctx: Context, sender: str, msg: AirportCodes):
    ctx.logger.info(f"Received message from {sender}, session: {ctx.session}")
    try:
        symbol = msg.carrier_code
        fn = msg.flight_number
        message = await scrape_airport_codes(symbol,fn)
        ctx.logger.info(f"message from endpoint: {message}")
        await ctx.send(sender, UAgentResponse(message=message, type=UAgentResponseType.FINAL))
    except Exception as ex:
        ctx.logger.warn(ex)
        await ctx.send(sender, UAgentResponse(message=str(ex), type=UAgentResponseType.ERROR))

agent.include(yahoo_protocol, publish_manifest=True)
