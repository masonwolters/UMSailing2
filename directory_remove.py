from selenium import webdriver
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.common.alert import Alert
from pyvirtualdisplay import Display
import time
import sys
import os

USERNAME = "woltersm"
PASSWORD = "Dunedain9723"

display = Display(visible=0, size=(800,600))
display.start()


# driver = webdriver.Firefox()
# chromedriver = os.path.dirname(os.path.abspath(__file__)) + '/chromedriver'
driver = webdriver.Firefox()
driver.implicitly_wait(15)

# driver.get("https://mcommunity.umich.edu/#group/members:Sailing%20Recruits")
driver.get("https://weblogin.umich.edu/?factors=UMICH.EDU&cosign-webdirectory.mc.itd&https://mcommunity.umich.edu/#group/members:Sailing%20Recruits")

username = driver.find_element_by_id('login')
username.send_keys(USERNAME)

password = driver.find_element_by_id('password')
password.send_keys(PASSWORD)

login = driver.find_element_by_id('loginSubmit')
login.click()



select = driver.find_element_by_xpath("//div[@id='memberPeopleContent']//select")
select.click()
options = select.find_elements_by_tag_name("option")
options[len(options)-1].click()

driver.implicitly_wait(2)

failed = []
success = []

for i in range(1, len(sys.argv)):
	uniqname = sys.argv[i]

	xpath = "//div[@class='uniqname' and text()='"+uniqname+"']/../../../..//input[@type='checkbox']"

	try:
		checkbox = driver.find_element_by_xpath(xpath)
		checkbox.click()
		success.append(uniqname)
	except Exception as e:
		failed.append(uniqname)

if len(success) > 0:
	driver.find_element_by_xpath("//button[text()='Remove Selected']").click()

	Alert(driver).accept()

output = "Successfully removed " + str(len(success)) + " uniqnames ["

for u in success:
	output += u + ", "
if len(success) > 0: output = output[:-2]
output += "]"

if len(failed) > 0:
	output += '\nError removing ' + str(len(failed)) + ' uniqnames ['

	for u in failed:
		output += u + ', '
	output = output[:-2]
	output += ']'

print(output)

