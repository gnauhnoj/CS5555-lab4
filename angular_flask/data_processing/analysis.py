import numpy as np
import datetime
import loader
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
    npa = np.array(zip(x,y))
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


def get_overall_data(dataset):
    x, y_steps, y_sed_act, y_med_act = get_data_over_period(dataset, FIRST_DATE.isoformat(), LAST_DATE.isoformat())
    return np.mean(y_steps), np.mean(y_sed_act), np.mean(y_med_act)


def get_last_year_data(dataset):
    x, y_steps, y_sed_act, y_med_act = get_data_over_period(dataset, str(LAST_DATE.year-1)+'-'+str(LAST_DATE.month)+'-'+'01', str(LAST_DATE.year-1)+'-'+str(LAST_DATE.month)+'-'+'30')
    return sum(y_steps), sum(y_sed_act), sum(y_med_act)


def get_recent_data(dataset):
    x, y_steps, y_sed_act, y_med_act = get_data_over_period(dataset, LAST_DATE-datetime.timedelta(days=30))
    x, y_steps, y_sed_act, y_med_act = sort_time(x, y_steps, y_sed_act, y_med_act)
    return sum(y_steps), sum(y_sed_act), sum(y_med_act)


if __name__ == '__main__':
    loader = reload(loader)
    # plot = reload(plot)
    dataset = loader.load_files('./data')
    x, y_steps, y_sed_act, y_med_act = get_data_over_period(dataset)
    # sx, sy_steps, sy_sed_act, sy_med_act = get_data_over_period(dataset, "2015-06-01", "2015-08-30")
    get_last_year_data(dataset)
    # print "Year:", np.mean(y_steps), np.mean(y_sed_act)
    # print "Year std:", np.std(y_steps), np.std(y_sed_act)
    # print "Year CI:", calculate_ci(y_steps), calculate_ci(y_sed_act)
    # print "Period", np.average(sy_steps), np.average(sy_sed_act)
    # y_steps = [dataset[key].activity['summary']['steps'] for key in dataset if dataset[key].activity['summary']['steps'] > 0]
    # print ystd
    # plot.plot_monthly_activity(dataset)
