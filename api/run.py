import base64
import io
import json
import re
import traceback


# Vercel serverless function handler
def handler(request):
    # Handle CORS preflight
    if request.method == "OPTIONS":
        return {
            "statusCode": 200,
            "headers": {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "POST, OPTIONS",
                "Access-Control-Allow-Headers": "Content-Type",
            },
            "body": "",
        }

    # Only allow POST
    if request.method != "POST":
        return {
            "statusCode": 405,
            "headers": {
                "Access-Control-Allow-Origin": "*",
                "Content-Type": "application/json",
            },
            "body": json.dumps({"error": "Method not allowed"}),
        }

    try:
        # Import heavy libraries inside handler for cold start optimization
        import control as ctl
        import matplotlib

        matplotlib.use("Agg")
        import matplotlib.pyplot as plt
        import numpy as np

        # Parse request body
        body = request.body
        if isinstance(body, bytes):
            body = body.decode("utf-8")
        data = json.loads(body)
        code = data.get("code", "")

        if not code.strip():
            return create_response(
                {
                    "success": False,
                    "plots": [],
                    "console": "",
                    "error": "No code provided",
                }
            )

        # Execute the code
        result = execute_matlab_code(code, ctl, plt, np)
        return create_response(result)

    except Exception as e:
        return create_response(
            {
                "success": False,
                "plots": [],
                "console": "",
                "error": f"Server error: {str(e)}\n{traceback.format_exc()}",
            }
        )


def create_response(data):
    return {
        "statusCode": 200,
        "headers": {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "POST, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type",
            "Content-Type": "application/json",
        },
        "body": json.dumps(data),
    }


def convert_vector(content):
    """Convert MATLAB vector notation to Python list"""
    content = content.strip()
    content = re.sub(r"\s+", ", ", content)
    content = re.sub(r",\s*-", ", -", content)
    return f"[{content}]"


def convert_matlab_to_python(matlab_code):
    """Convert MATLAB-like syntax to Python"""
    lines = matlab_code.split("\n")
    python_lines = []

    for line in lines:
        line = line.strip()

        # Skip empty lines and comments
        if not line or line.startswith("%"):
            if line.startswith("%"):
                python_lines.append("#" + line[1:])
            continue

        # Remove trailing semicolon
        line = line.rstrip(";")

        if not line:
            continue

        # Convert MATLAB vectors [1 2 3] to Python [1, 2, 3]
        line = re.sub(r"\[([^\]]+)\]", lambda m: convert_vector(m.group(1)), line)

        # Handle figure command
        if re.match(r"^figure\s*\(?(\d*)\)?", line, re.IGNORECASE):
            match = re.match(r"^figure\s*\(?\s*(\d*)\s*\)?", line, re.IGNORECASE)
            fig_num = match.group(1) if match and match.group(1) else "1"
            python_lines.append(f"plt.figure({fig_num})")
            continue

        # Handle hold on/off
        if line.lower() in ["hold on", "hold off"]:
            continue

        # Handle grid on/off
        if line.lower() == "grid on":
            python_lines.append("plt.grid(True)")
            continue
        if line.lower() == "grid off":
            python_lines.append("plt.grid(False)")
            continue

        # Handle title
        match = re.match(r"title\s*\(\s*['\"](.+)['\"]\s*\)", line)
        if match:
            python_lines.append(f"plt.title('{match.group(1)}')")
            continue

        # Handle xlabel/ylabel
        match = re.match(r"(xlabel|ylabel)\s*\(\s*['\"](.+)['\"]\s*\)", line)
        if match:
            python_lines.append(f"plt.{match.group(1)}('{match.group(2)}')")
            continue

        # Handle legend
        match = re.match(r"legend\s*\((.+)\)", line)
        if match:
            python_lines.append(f"plt.legend([{match.group(1)}])")
            continue

        # Handle tf command
        line = re.sub(r"\btf\s*\(", "ctl.tf(", line)

        # Handle conv command
        line = re.sub(r"\bconv\s*\(", "np.convolve(", line)

        # Handle feedback command
        line = re.sub(r"\bfeedback\s*\(", "ctl.feedback(", line)

        # Handle step command
        match = re.match(r"step\s*\(\s*(\w+)\s*(?:,\s*['\"]?(\w+)['\"]?)?\s*\)", line)
        if match:
            sys_var = match.group(1)
            color = match.group(2)
            color_map = {
                "r": "red",
                "g": "green",
                "b": "blue",
                "k": "black",
                "m": "magenta",
                "c": "cyan",
                "y": "yellow",
            }
            if color:
                color = color_map.get(color, color)
                python_lines.append(f"_t, _y = ctl.step_response({sys_var})")
                python_lines.append(
                    f"plt.plot(_t, _y, color='{color}', label='Step Response')"
                )
            else:
                python_lines.append(f"_t, _y = ctl.step_response({sys_var})")
                python_lines.append(f"plt.plot(_t, _y, label='Step Response')")
            python_lines.append("plt.xlabel('Time (s)')")
            python_lines.append("plt.ylabel('Amplitude')")
            continue

        # Handle impulse command
        match = re.match(
            r"impulse\s*\(\s*(\w+)\s*(?:,\s*['\"]?(\w+)['\"]?)?\s*\)", line
        )
        if match:
            sys_var = match.group(1)
            color = match.group(2)
            color_map = {
                "r": "red",
                "g": "green",
                "b": "blue",
                "k": "black",
                "m": "magenta",
                "c": "cyan",
                "y": "yellow",
            }
            if color:
                color = color_map.get(color, color)
                python_lines.append(f"_t, _y = ctl.impulse_response({sys_var})")
                python_lines.append(
                    f"plt.plot(_t, _y, color='{color}', label='Impulse Response')"
                )
            else:
                python_lines.append(f"_t, _y = ctl.impulse_response({sys_var})")
                python_lines.append(f"plt.plot(_t, _y, label='Impulse Response')")
            python_lines.append("plt.xlabel('Time (s)')")
            python_lines.append("plt.ylabel('Amplitude')")
            continue

        # Handle pzmap command
        match = re.match(r"pzmap\s*\(\s*(\w+)\s*\)", line)
        if match:
            python_lines.append(f"ctl.pzmap({match.group(1)}, plot=True)")
            python_lines.append("plt.title('Pole-Zero Map')")
            continue

        # Handle bode command
        match = re.match(r"bode\s*\(\s*(\w+)\s*\)", line)
        if match:
            python_lines.append(f"ctl.bode_plot({match.group(1)})")
            continue

        # Handle margin command
        match = re.match(r"margin\s*\(\s*(\w+)\s*\)", line)
        if match:
            python_lines.append(f"ctl.bode_plot({match.group(1)}, margins=True)")
            continue

        # Handle rlocus command
        match = re.match(r"rlocus\s*\(\s*(\w+)\s*\)", line)
        if match:
            python_lines.append(f"ctl.root_locus({match.group(1)}, plot=True)")
            python_lines.append("plt.title('Root Locus')")
            continue

        # Handle nyquist command
        match = re.match(r"nyquist\s*\(\s*(\w+)\s*\)", line)
        if match:
            python_lines.append(f"ctl.nyquist_plot({match.group(1)})")
            continue

        # Handle pole/zero functions
        line = re.sub(r"\bpole\s*\(", "ctl.poles(", line)
        line = re.sub(r"\bzero\s*\(", "ctl.zeros(", line)

        # Handle series/parallel
        line = re.sub(r"\bseries\s*\(", "ctl.series(", line)
        line = re.sub(r"\bparallel\s*\(", "ctl.parallel(", line)

        # Handle dcgain
        line = re.sub(r"\bdcgain\s*\(", "ctl.dcgain(", line)

        # Handle disp as print
        match = re.match(r"disp\s*\(\s*(.+)\s*\)", line)
        if match:
            python_lines.append(f"print({match.group(1)})")
            continue

        # Default: pass through
        python_lines.append(line)

    return "\n".join(python_lines)


def execute_matlab_code(code, ctl, plt, np):
    """Execute MATLAB-like code and return results"""
    import sys
    from io import StringIO

    plots = []
    console_output = []

    plt.close("all")

    # Capture stdout
    old_stdout = sys.stdout
    sys.stdout = StringIO()

    env = {
        "np": np,
        "plt": plt,
        "ctl": ctl,
        "print": print,
    }

    python_code = convert_matlab_to_python(code)
    console_output.append(f"# Converted Python Code:\n{python_code}\n")

    try:
        exec(python_code, env)

        # Get print output
        print_output = sys.stdout.getvalue()
        if print_output:
            console_output.append(f"\n# Output:\n{print_output}")

        # Capture all figures as PNG
        for fig_num in plt.get_fignums():
            fig = plt.figure(fig_num)
            buf = io.BytesIO()
            fig.savefig(
                buf, format="png", bbox_inches="tight", facecolor="white", dpi=100
            )
            buf.seek(0)
            img_base64 = base64.b64encode(buf.getvalue()).decode("utf-8")
            plots.append({"id": f"plot_{fig_num}", "image": img_base64})

        plt.close("all")
        sys.stdout = old_stdout

        return {
            "success": True,
            "plots": plots,
            "console": "\n".join(console_output),
            "error": None,
        }

    except Exception as e:
        plt.close("all")
        sys.stdout = old_stdout
        error_msg = f"{type(e).__name__}: {str(e)}\n{traceback.format_exc()}"
        return {
            "success": False,
            "plots": [],
            "console": "\n".join(console_output),
            "error": error_msg,
        }
