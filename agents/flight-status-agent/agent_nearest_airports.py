# Here we demonstrate how we can create a stock price agent that is compatible with DeltaV.

# After running this agent, it can be registered to DeltaV on Agentverse's Services tab. For registration you will have to use the agent's address. 
#
# third party modules used in this example
from pydantic import Field
import requests
from ai_engine import UAgentResponse, UAgentResponseType
import os
import json
from pydantic import Field, BaseModel
import requests

from superjsonmode.integrations.openai import StructuredOpenAIModel

import openai
import requests
GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")

# To use this example, you will need to provide an API key for RapidAPI: https://rapidapi.com
# You can define your RAPIDAPI_API_KEY value in the .env file
if RAPIDAPI_API_KEY == "YOUR_RAPIDAPI_API_KEY":
    raise Exception("You need to provide an API key for RapidAPI to use this example")


class Airport(Model):
    symbol: str = Field(description="IATA symbol of airport you want to get disruptions for. For example: LHR, JFK, LAX, AMS, CDG etc.")

# Method that send the request to the endpoint which retrieves stock price for the specific share symbol
async def get_nearest_airports(location):
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

    nearest_airports = response.choices[0].message.content
    # parse JSON response
    nearest_airports = json.loads(nearest_airports)['data']
    nearest_airports = list(filter(lambda x: x['iata'] != src, nearest_airports))
    nearest_airports = sorted(nearest_airports, key=lambda x: x['distance_in_miles'])
    nearest_airports = [airport['iata'] for airport in nearest_airports]
    return nearest_airports

yahoo_protocol = Protocol("NearestAirports")

# Message handler for data requests sent to this agent
@yahoo_protocol.on_message(model=Airport, replies={UAgentResponse})
async def yahoo_share(ctx: Context, sender: str, msg: Airport):
    ctx.logger.info(f"Received message from {sender}, session: {ctx.session}")
    try:
        symbol = msg.symbol
        message = await get_nearest_airports(symbol)
        ctx.logger.info(f"message from endpoint: {message}")
        await ctx.send(sender, UAgentResponse(message=message, type=UAgentResponseType.FINAL))
    except Exception as ex:
        ctx.logger.warn(ex)
        await ctx.send(sender, UAgentResponse(message=str(ex), type=UAgentResponseType.ERROR))

agent.include(yahoo_protocol, publish_manifest=True)
