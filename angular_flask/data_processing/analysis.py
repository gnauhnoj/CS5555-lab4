import numpy as np
import datetime
import loader
from scipy import stats

#calculate confidence interval
def calculate_ci(data, level=0.95):
	a = 1.0*np.array(data)
	n = len(a)
	m, se = np.mean(a), stats.sem(a)
	h = se*stats.t._ppf((1+level)/2., n-1)
	return m-h, m+h

def get_data_over_period(dataset, startdate=None, enddate=None):
	if (startdate is not None) and (enddate is not None):
		start = datetime.datetime.strptime(startdate, '%Y-%m-%d')
		end = datetime.datetime.strptime(enddate, '%Y-%m-%d')
		subset = [key for key in dataset if dataset[key].date>=start and dataset[key].date<=end]
	else:
		subset = [key for key in dataset]
	x = [dataset[key].date for key in subset if dataset[key].activity['summary']['steps'] > 0]
	y_steps = [dataset[key].activity['summary']['steps'] for key in subset if dataset[key].activity['summary']['steps'] > 0]
	y_sed_act = [dataset[key].activity['summary']['sedentaryMinutes'] for key in subset if dataset[key].activity['summary']['steps'] > 0]
	return x, y_steps, y_sed_act

if __name__ == '__main__':
	loader = reload(loader)
	#plot = reload(plot)
	dataset = loader.load_files()
	x, y_steps, y_sed_act = get_data_over_period(dataset)
	sx, sy_steps, sy_sed_act = get_data_over_period(dataset, "2015-06-01", "2015-08-30")
	print "Year:", np.mean(y_steps), np.mean(y_sed_act)
	print "Year std:", np.std(y_steps), np.std(y_sed_act)
	print "Year CI:", calculate_ci(y_steps), calculate_ci(y_sed_act)
	print "Period", np.average(sy_steps), np.average(sy_sed_act)
	#y_steps = [dataset[key].activity['summary']['steps'] for key in dataset if dataset[key].activity['summary']['steps'] > 0]
	#print ystd
	#plot.plot_monthly_activity(dataset)
