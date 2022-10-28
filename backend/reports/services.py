from geopy.distance import geodesic


def calculate_distance_deviation(data, worksite):
    dist = (worksite.latitude, worksite.longitude)
    origin = (data['latitude'], data['longitude'])
    return geodesic(origin, dist).miles
