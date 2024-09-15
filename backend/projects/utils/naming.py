import random
from os import path

# cache so we only have to read files once
cache = {}


def random_teamname() -> str:
    # get absolute path of script
    dir = path.dirname(__file__)
    if "adjectives" in cache:
        adjectives = cache["adjectives"]
    else:
        f = open(path.join(dir, "adjectives.txt"), "r")
        adjectives = f.read().splitlines()
        f.close()
        cache["adjectives"] = adjectives

    if "animals" in cache:
        animals = cache["animals"]
    else:
        f = open(path.join(dir, "animals.txt"), "r")
        animals = f.read().splitlines()
        f.close()
        cache["animals"] = animals

    return random.choice(adjectives) + " " + random.choice(animals)
