import numpy as np
import datetime
import loader
from math import floor
from scipy import stats
FIRST_DATE = datetime.date(2014, 11, 01)
LAST_DATE = datetime.date(2015, 11, 17)


# calculate confidence interval
def calculate_ci(data, level=0.95):
    a = 1.0*np.array(data)
    n = len(a)
    # Question for Jing: Can we do without this? Installing scipy is so annoying to deploy
    # need to think about it...
    m, se = np.mean(a), stats.sem(a)
    h = se*stats.t._ppf((1+level)/2., n-1)
    return m-h, m+h


# sort nparrays according to the provided time stamp
def sort_time(x, y, y_next=None, y_next_next=None):
    npa = np.array(zip(x, y))
    if y_next is not None:
        npa = np.column_stack([npa, y_next])
        if y_next_next is not None:
            npa = np.column_stack([npa, y_next_next])
    npa = npa[npa[:, 0].argsort()]
    if (y_next is not None) and (y_next_next is not None):
        return npa[:, 0], npa[:, 1], npa[:, 2], npa[:, 3]
    elif (y_next is not None):
        return npa[:, 0], npa[:, 1], npa[:, 2]
    return npa[:, 0], npa[:, 1]


def get_data_over_period(dataset, startdate=None, enddate=None, serialize_dates=False):
    if (startdate is not None) and (enddate is not None):
        start = datetime.datetime.strptime(startdate, '%Y-%m-%d')
        end = datetime.datetime.strptime(enddate, '%Y-%m-%d')
        subset = [key for key in dataset if dataset[key].date >= start and dataset[key].date <= end]
    else:
        subset = [key for key in dataset]
    x = [dataset[key].date for key in subset if dataset[key].activity['summary']['steps'] > 0]
    if serialize_dates:
        x = [date.isoformat() for date in x]
    y_steps = [dataset[key].activity['summary']['steps'] for key in subset if dataset[key].activity['summary']['steps'] > 0]
    y_sed_act = [dataset[key].activity['summary']['sedentaryMinutes'] for key in subset if dataset[key].activity['summary']['steps'] > 0]
    y_med_act = [dataset[key].activity['summary']['fairlyActiveMinutes'] for key in subset if dataset[key].activity['summary']['steps'] > 0]
    x, y_steps, y_sed_act, y_med_act = sort_time(x, y_steps, y_sed_act, y_med_act)
    return x.tolist(), y_steps.tolist(), y_sed_act.tolist(), y_med_act.tolist()


def test_point_ci(tuple, value):
    if value < tuple[0]:
        return -1
    elif value > tuple[1]:
        return 1
    else:
        return 0


def test_good_bad(good, value):
    return good*value


def handle_analysis_request(dataset, date_list):
    x, y_steps, y_sed_act, y_med_act = get_data_over_period(dataset, FIRST_DATE.isoformat(), LAST_DATE.isoformat())
    total_sy_steps = []
    total_sy_sed_act = []
    total_sy_med_act = []
    for interval in date_list:
        sx, sy_steps, sy_sed_act, sy_med_act = get_data_over_period(dataset, interval[0], interval[1])
        total_sy_steps += sy_steps
        total_sy_sed_act += sy_sed_act
        total_sy_med_act += sy_med_act

    # print "Year STD:", np.std(y_steps), np.std(y_sed_act), np.std(y_med_act)
    mean_sy_steps = np.mean(total_sy_steps)
    mean_sy_sed_act = np.mean(total_sy_sed_act)
    mean_sy_med_act = np.average(total_sy_med_act)

    ci_steps = calculate_ci(y_steps)
    ci_sed_act = calculate_ci(y_sed_act)
    ci_med_act = calculate_ci(y_med_act)

    out = {}
    out['mean'] = {
        'steps': floor(mean_sy_steps),
        'sed_act': floor(mean_sy_sed_act),
        'med_act': floor(mean_sy_med_act)
    }
    out['diff'] = {
        'steps': floor(mean_sy_steps - np.mean(y_steps)),
        'sed_act': floor(mean_sy_sed_act - np.mean(y_sed_act)),
        'med_act': floor(mean_sy_med_act - np.mean(y_med_act))
    }
    out['ci_test'] = {
        'steps': test_good_bad(1, test_point_ci(ci_steps, mean_sy_steps)),
        'sed_act': test_good_bad(-1, test_point_ci(ci_sed_act, mean_sy_sed_act)),
        'med_act': test_good_bad(1, test_point_ci(ci_med_act, mean_sy_med_act))
    }
    return out


def get_overall_data(dataset):
    x, y_steps, y_sed_act, y_med_act = get_data_over_period(dataset, FIRST_DATE.isoformat(), LAST_DATE.isoformat())
    return np.mean(y_steps), np.mean(y_sed_act), np.mean(y_med_act)


def get_last_year_data(dataset):
    x, y_steps, y_sed_act, y_med_act = get_data_over_period(dataset, str(LAST_DATE.year-1)+'-'+str(LAST_DATE.month)+'-'+'01', str(LAST_DATE.year-1)+'-'+str(LAST_DATE.month)+'-'+'30')
    return sum(y_steps), sum(y_sed_act), sum(y_med_act)


def get_recent_data(dataset, timedelta=30):
    x, y_steps, y_sed_act, y_med_act = get_data_over_period(dataset, (LAST_DATE-datetime.timedelta(days=timedelta)).isoformat(), LAST_DATE.isoformat())
    x, y_steps, y_sed_act, y_med_act = sort_time(x, y_steps, y_sed_act, y_med_act)
    return np.mean(y_steps), np.mean(y_sed_act), np.mean(y_med_act)


def get_mo_data(dataset):
    x, y_steps, y_sed_act, y_med_act = get_data_over_period(dataset, str(LAST_DATE.year)+'-'+str(LAST_DATE.month)+'-01', LAST_DATE.isoformat())
    return sum(y_steps), sum(y_sed_act), sum(y_med_act)


def handle_recc_request(dataset):
    overall_steps, overall_sed_act, overall_med_act = get_overall_data(dataset)
    out = {}
    out['mo'] = LAST_DATE.strftime("%B")
    out['lifetime'] = {
        'steps': overall_steps,
        'sed_act': overall_sed_act,
        'med_act': overall_med_act
    }
    x, y_steps, y_sed_act, y_med_act = get_data_over_period(dataset, FIRST_DATE.isoformat(), LAST_DATE.isoformat())
    steps_ci = calculate_ci(y_steps)
    sed_act_ci = calculate_ci(y_sed_act)
    med_act_ci = calculate_ci(y_med_act)
    recent_steps, recent_sed_act, recent_med_act = get_recent_data(dataset)
    out['recent'] = {
        'steps': round(recent_steps, 0),
        'sed_act': round(recent_sed_act, 0),
        'med_act': round(recent_med_act, 0),
        'steps_ci': test_point_ci(steps_ci, recent_steps),
        'sed_act_ci': test_point_ci(sed_act_ci, recent_sed_act),
        'med_act_ci': test_point_ci(med_act_ci, recent_med_act)
    }
    mo_steps, mo_sed_act, mo_med_act = get_mo_data(dataset)
    out['month'] = {
        'steps': mo_steps,
        'sed_act': mo_sed_act,
        'med_act': mo_med_act
    }
    lm_steps, lm_sed_act, lm_med_act = get_last_year_data(dataset)
    out['last'] = {
        'steps': lm_steps,
        'sed_act': lm_sed_act,
        'med_act': lm_med_act,
        'steps_ci': test_point_ci(steps_ci, float(lm_steps)/30),
        'sed_act_ci': test_point_ci(sed_act_ci, float(lm_sed_act)/30),
        'med_act_ci': test_point_ci(med_act_ci, float(lm_med_act)/30)
    }
    return out


if __name__ == '__main__':
    loader = reload(loader)
    # plot = reload(plot)
    dataset = loader.load_files('./data')
    x, y_steps, y_sed_act, y_med_act = get_data_over_period(dataset)
    # sx, sy_steps, sy_sed_act, sy_med_act = get_data_over_period(dataset, "2015-06-01", "2015-08-30")
    get_last_year_data(dataset)
    print "Year:", np.mean(y_steps), np.mean(y_sed_act)
    # print "Year std:", np.std(y_steps), np.std(y_sed_act)
    # print "Year CI:", calculate_ci(y_steps), calculate_ci(y_sed_act)
    # print "Period", np.average(sy_steps), np.average(sy_sed_act)
    # y_steps = [dataset[key].activity['summary']['steps'] for key in dataset if dataset[key].activity['summary']['steps'] > 0]
    # print ystd
    # plot.plot_monthly_activity(dataset)
