#!/bin/zsh

# Check if Python is installed
if command -v python &>/dev/null; then
    echo "Python is installed"
else
    echo "Python is not installed"
    exit 1
fi

# Check if virtualenv is installed
if ! command -v virtualenv &>/dev/null; then
    echo "virtualenv is not installed, installing..."
    pip3 install virtualenv
fi

# Define the virtual environment directory
venv_dir="myenv"

# Check if the virtual environment already exists
if [ -d "$venv_dir" ]; then
    echo "Activating existing virtual environment..."
    source "$venv_dir/bin/activate"
else
    echo "Creating and activating a new virtual environment..."
    virtualenv -p python3 "$venv_dir"  # Specify Python 3 during creation
    source "$venv_dir/bin/activate"
fi

# Check if Flask is installed in the virtual environment
if ! python -m pip show flask &>/dev/null; then
    echo "Flask is not installed in the virtual environment, installing..."
    pip install flask
fi

# Check if port 5000 is in use and kill the process if it is
if lsof -ti :5000 &>/dev/null; then
    echo "Port 5000 is in use, killing the process..."
    kill -9 $(lsof -ti :5000)
fi

# Get the absolute path of the script
script_path="$(realpath "$0")"

# Get the directory containing the script (your Flask file should be in the same directory)
flask_directory="$(dirname "$script_path")"
echo "Flask directory: $flask_directory"

# Start your Flask application here
echo "Starting Flask web server..."
#export FLASK_APP=app FLASK_ENV=development FLASK_DEBUG=false
python -m flask --app $flask_directory"/app" run &

# Get the URL and port of the Flask server
url="http://127.0.0.1:5000"  # Change the port if your Flask app runs on a different port

# Open a web browser with the URL
echo "waiting ..."
sleep 2  # Wait for 2 seconds
echo "Opening web browser at $url"
open "$url"