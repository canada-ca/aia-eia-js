# little script to parse survey-enfr.json and produce a CSV of the questions
# and the max score associated with the question.
# When multiple answers are possible for a given question, the scores are added.
# For questions with a single answer out of multiples, the highest value is chosen.
# To avoid duplicates, only considers design-stage questions.

import json,os,csv

cur_path = os.path.dirname(__file__)

with open(cur_path+"\\src\\survey-enfr.json", mode='r') as file:
    survey_data = json.load(file)

def iterate_plural(i):
    """ Iterate a list or dictionary. Return True if arg was dict or list, False otherwise"""
    if isinstance(i, dict):
        iterate_dictionary(i)
        return True
    elif isinstance(i, list):
        iterate_list(i)
        return True
    return False

def iterate_dictionary(d):
    if 'visibleIf' in d and d['visibleIf'] == "{projectDetailsPhase} = \"item2\"":
        return # skip implementation phase question which duplicate design stage

    q_types = { 'checkbox': sum, 'radiogroup': max, 'dropdown': max, 'comment': sum, 'text': sum}
    if 'type' in d:
        if d['type'] in q_types.keys():
            add_question(d, q_types[d['type']])
            return
    
    for v in d.values():
        iterate_plural(v)

def add_question(d,score_function):
    english = d['title']['default']#, d['title']['fr']
    scores = collect_value_scores(d)
    questions.append([english,score_function(scores)])

def collect_value_scores(d):
    scores = []
    if not 'choices' in d:
        return scores
    for c in d['choices']:
        scores.append(parse_value_score(c['value']))
    return scores

def parse_value_score(val):
    # "item6-1", the 1 is the score
    if '-' not in val:
        return 0
    return int(val.split('-')[-1])

def iterate_list(l):
    for i in l:
        iterate_plural(i)

questions = []
iterate_dictionary(survey_data)
with open(cur_path+"\\survey-enfr.csv", 'w', newline='') as csvfile:
    csvwriter = csv.writer(csvfile)
    csvwriter.writerow(["Question","Max Score"])
    csvwriter.writerows(questions)