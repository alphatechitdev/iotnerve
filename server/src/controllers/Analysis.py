from flask import Flask, request, jsonify
import numpy as np

app = Flask(__name__)

@app.route('/process', methods=['POST'])
def process_query():
    try:
        data = request.json
        device_type = data.get("device_type")
        query_command = data.get("query_command")
        values = data.get("data")
        timestamps = data.get("timestamps", None)
        
        if not device_type or not query_command or not values:
            return jsonify({"error": "Missing required fields"}), 400
        
        # Execute the function from query_command
        exec(query_command, globals())
        
        # Extract function name from query_command
        function_name = query_command.split('def ')[1].split('(')[0]
        
        # Call the function dynamically
        result = globals()[function_name](values, timestamps) if "timestamps" in query_command else globals()[function_name](values)
        
        return jsonify({"device_type": device_type, "result": result})
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
