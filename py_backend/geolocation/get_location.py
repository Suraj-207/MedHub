import config
from geopy.geocoders import Nominatim


class Geolocation:

    def __init__(self, longitude, latitude):
        try:
            geolocator = Nominatim(user_agent="geoapiExercises")
            location = geolocator.reverse(latitude + "," + longitude)
            self.address = location.raw['address']
        except Exception as e:
            config.logger.log("ERROR", str(e))

    def get_city(self):
        return self.address['city']

    def get_state(self):
        return self.address['state']
