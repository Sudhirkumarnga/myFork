from geopy.distance import geodesic


def calculate_distance_deviation(data, worksite):
    dist = (worksite.latitude, worksite.longitude)
    origin = (data['latitude'], data['longitude'])
    return geodesic(origin, dist).miles


def get_stats(tasks):
    SATISFACTORY, NEEDS_ATTENTION, UNSATISFACTORY, null = 0, 0, 0, 0
    for task in tasks:
        if task['feedback'] == "SATISFACTORY":
            SATISFACTORY += 1
        if task['feedback'] == "NEEDS_ATTENTION":
            NEEDS_ATTENTION += 1
        if task['feedback'] == "UNSATISFACTORY":
            UNSATISFACTORY += 1
        if task['feedback'] is None:
            null += 1

    return {
        "SATISFACTORY": SATISFACTORY,
        "NEEDS_ATTENTION": NEEDS_ATTENTION,
        "UNSATISFACTORY": UNSATISFACTORY,
        None: null,
    }
