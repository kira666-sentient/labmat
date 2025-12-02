// ===== MATLAB-Lite Control Systems IDE =====
// Complete Application JavaScript

// ===== Configuration =====
const CONFIG = {
  API_URL: "/api/run",
  LOCAL_API: "http://localhost:5000/api/run",
  USE_LOCAL: false, // Set to false for Vercel deployment
};

// ===== Practicals Data =====
const PRACTICALS = [
  {
    id: 1,
    title: "Transfer Function & Pole-Zero Map",
    objective:
      "Learn to create Transfer Functions using tf() and visualize Poles and Zeros using pzmap().",
    theory: `
            <h4>📐 Transfer Function</h4>
            <p>A Transfer Function represents the relationship between input and output of a Linear Time-Invariant (LTI) system in the Laplace domain:</p>
            <div class="formula-box">$$G(s) = \\frac{Y(s)}{X(s)} = \\frac{N(s)}{D(s)} = \\frac{b_m s^m + b_{m-1}s^{m-1} + ... + b_0}{a_n s^n + a_{n-1}s^{n-1} + ... + a_0}$$</div>

            <h4>🎯 Poles and Zeros</h4>
            <ul>
                <li><strong>Zeros:</strong> Roots of numerator N(s) - values where G(s) = 0</li>
                <li><strong>Poles:</strong> Roots of denominator D(s) - values where G(s) → ∞</li>
            </ul>

            <div class="key-point">
                <strong>⚡ Stability Rule:</strong> A system is stable if ALL poles lie in the Left Half Plane (LHP), i.e., real part < 0. Poles in RHP = Unstable!
            </div>

            <h4>💻 MATLAB Commands</h4>
            <pre>num = [1 4 3];        % Numerator coefficients (s² + 4s + 3)
den = [1 9 23 15];    % Denominator coefficients
G = tf(num, den);     % Create transfer function
pzmap(G);             % Plot pole-zero map</pre>
        `,
    code: `% Practical 1: Transfer Function and Pole-Zero Map
% G(s) = (s² + 4s + 3) / [(s+5)(s² + 4s + 7)]

num = [1 4 3];
den = conv([1 5], [1 4 7]);
G = tf(num, den);
pzmap(G);
title('Pole-Zero Map of G(s)');
grid on;`,
    explanations: {
      "num = [1 4 3]":
        "Defines numerator polynomial: s² + 4s + 3. Coefficients in descending powers of s. Roots (zeros) at s = -1 and s = -3.",
      "den = conv([1 5], [1 4 7])":
        "Multiplies (s+5) × (s² + 4s + 7) using convolution. This gives the denominator polynomial.",
      "G = tf(num, den)":
        "Creates transfer function G(s) = num/den. This is the Laplace domain representation of the system.",
      "pzmap(G)":
        "Plots poles (×) and zeros (○) on complex plane. Poles determine system stability and response characteristics.",
    },
  },
  {
    id: 2,
    title: "First Order System Response",
    objective:
      "Analyze step and impulse response of a first-order system with unity feedback.",
    theory: `
            <h4>📐 First Order System</h4>
            <p>Standard form of first-order transfer function:</p>
            <div class="formula-box">$$G(s) = \\frac{K}{\\tau s + 1}$$</div>
            <p>Where: K = DC gain, τ = Time constant</p>

            <h4>⏱️ Time Domain Specifications</h4>
            <ul>
                <li><strong>Time Constant (τ):</strong> Time to reach 63.2% of final value</li>
                <li><strong>Rise Time (tᵣ):</strong> Time from 10% to 90% ≈ 2.2τ</li>
                <li><strong>Settling Time (tₛ):</strong> Time to stay within 2% ≈ 4τ</li>
                <li><strong>No Overshoot:</strong> First-order systems never overshoot!</li>
            </ul>

            <div class="key-point">
                <strong>⚡ Key Formula:</strong> For G(s) = 1/(s+a), τ = 1/a
            </div>

            <h4>🔄 Unity Feedback</h4>
            <p>Closed-loop transfer function with unity feedback (H=1):</p>
            <div class="formula-box">$$T(s) = \\frac{G(s)}{1 + G(s)}$$</div>
        `,
    code: `% Practical 2: First Order System Response
% G(s) = 1/(s+4), Unity feedback

num = [1];
den = [1 4];
G = tf(num, den);
T = feedback(G, 1);

figure(1);
step(T);
title('Step Response - First Order System');
grid on;

figure(2);
impulse(T);
title('Impulse Response - First Order System');
grid on;`,
    explanations: {
      "num = [1]":
        "Numerator is constant 1. First-order systems typically have no zeros.",
      "den = [1 4]":
        "Denominator is (s + 4). Pole at s = -4, so time constant τ = 1/4 = 0.25 seconds.",
      "G = tf(num, den)": "Open-loop transfer function G(s) = 1/(s+4).",
      "T = feedback(G, 1)":
        "Creates closed-loop system with unity feedback: T(s) = G/(1+G) = 1/(s+5).",
      "step(T)":
        "Plots unit step response - shows how system responds to sudden constant input.",
      "impulse(T)":
        "Plots impulse response - shows natural behavior of system (decays exponentially).",
    },
  },
  {
    id: 3,
    title: "Second Order System Response",
    objective:
      "Analyze step response of second-order system and determine time domain specifications.",
    theory: `
            <h4>📐 Second Order System</h4>
            <p>Standard form:</p>
            <div class="formula-box">$$G(s) = \\frac{\\omega_n^2}{s^2 + 2\\zeta\\omega_n s + \\omega_n^2}$$</div>

            <h4>🎛️ Key Parameters</h4>
            <ul>
                <li><strong>ωₙ (Natural Frequency):</strong> Speed of oscillation (rad/s)</li>
                <li><strong>ζ (Damping Ratio):</strong> Controls oscillation decay</li>
            </ul>

            <h4>📊 Response Types Based on ζ</h4>
            <ul>
                <li><strong>ζ > 1:</strong> Overdamped - No oscillation, slow response</li>
                <li><strong>ζ = 1:</strong> Critically damped - Fastest without overshoot</li>
                <li><strong>0 < ζ < 1:</strong> Underdamped - Oscillatory with overshoot</li>
                <li><strong>ζ = 0:</strong> Undamped - Continuous oscillation</li>
            </ul>

            <h4>⏱️ Time Specifications (Underdamped)</h4>
            <div class="formula-box">$$M_p = e^{\\frac{-\\pi\\zeta}{\\sqrt{1-\\zeta^2}}} \\times 100\\%$$</div>
            <div class="formula-box">$$t_s \\approx \\frac{4}{\\zeta\\omega_n} \\text{ (2% criterion)}$$</div>
            <div class="formula-box">$$t_r \\approx \\frac{1.8}{\\omega_n}$$</div>
        `,
    code: `% Practical 3: Second Order System Response
% G(s) = 1/(s² + s + 4), Unity feedback
% ωn² = 4, 2ζωn = 1 → ωn = 2, ζ = 0.25

num = [1];
den = [1 1 4];
G = tf(num, den);
T = feedback(G, 1);

step(T);
title('Step Response - Second Order System (ζ = 0.25)');
grid on;`,
    explanations: {
      "num = [1]":
        "Numerator = 1. Standard second-order form has constant numerator ωn².",
      "den = [1 1 4]":
        "Denominator s² + s + 4. Comparing with s² + 2ζωns + ωn²: ωn² = 4, so ωn = 2 rad/s. 2ζωn = 1, so ζ = 0.25 (underdamped).",
      "G = tf(num, den)": "Open-loop transfer function.",
      "T = feedback(G, 1)": "Closed-loop with unity feedback.",
      "step(T)":
        "Shows oscillatory response due to low damping ratio (ζ = 0.25). Expect significant overshoot!",
    },
  },
  {
    id: 4,
    title: "Type 0, 1, 2 Systems",
    objective:
      "Understand the effect of integrators (poles at origin) on steady-state error.",
    theory: `
            <h4>📐 System Type Definition</h4>
            <p><strong>System Type N</strong> = Number of poles at s = 0 (integrators in open-loop)</p>
            <div class="formula-box">$$G(s) = \\frac{K \\cdot (\\text{zeros})}{s^N \\cdot (\\text{other poles})}$$</div>

            <h4>📊 Steady-State Error</h4>
            <table style="width:100%; border-collapse: collapse; margin: 16px 0;">
                <tr style="background: var(--surface);">
                    <th style="padding: 10px; border: 1px solid var(--border);">Input</th>
                    <th style="padding: 10px; border: 1px solid var(--border);">Type 0</th>
                    <th style="padding: 10px; border: 1px solid var(--border);">Type 1</th>
                    <th style="padding: 10px; border: 1px solid var(--border);">Type 2</th>
                </tr>
                <tr>
                    <td style="padding: 10px; border: 1px solid var(--border);">Step</td>
                    <td style="padding: 10px; border: 1px solid var(--border);">1/(1+Kp)</td>
                    <td style="padding: 10px; border: 1px solid var(--border);">0</td>
                    <td style="padding: 10px; border: 1px solid var(--border);">0</td>
                </tr>
                <tr>
                    <td style="padding: 10px; border: 1px solid var(--border);">Ramp</td>
                    <td style="padding: 10px; border: 1px solid var(--border);">∞</td>
                    <td style="padding: 10px; border: 1px solid var(--border);">1/Kv</td>
                    <td style="padding: 10px; border: 1px solid var(--border);">0</td>
                </tr>
                <tr>
                    <td style="padding: 10px; border: 1px solid var(--border);">Parabola</td>
                    <td style="padding: 10px; border: 1px solid var(--border);">∞</td>
                    <td style="padding: 10px; border: 1px solid var(--border);">∞</td>
                    <td style="padding: 10px; border: 1px solid var(--border);">1/Ka</td>
                </tr>
            </table>

            <h4>🔑 Error Constants</h4>
            <ul>
                <li><strong>Kp (Position):</strong> lim(s→0) G(s)</li>
                <li><strong>Kv (Velocity):</strong> lim(s→0) s·G(s)</li>
                <li><strong>Ka (Acceleration):</strong> lim(s→0) s²·G(s)</li>
            </ul>

            <div class="warning-box">
                ⚠️ Higher type systems may become unstable! Always check closed-loop stability.
            </div>
        `,
    code: `% Practical 4: Type 0, 1, 2 Systems Comparison

num = [1];

% Type 0 System (no integrator)
den0 = [1 1 4];
G0 = tf(num, den0);
T0 = feedback(G0, 1);

% Type 1 System (one integrator - one pole at s=0)
den1 = [1 1 4 0];
G1 = tf(num, den1);
T1 = feedback(G1, 1);

% Type 2 System (two integrators)
den2 = [1 1 4 0 0];
G2 = tf(num, den2);
T2 = feedback(G2, 1);

figure(1);
step(T0);
title('Type 0 System');
grid on;

figure(2);
step(T1);
title('Type 1 System');
grid on;

figure(3);
step(T2);
title('Type 2 System');
grid on;`,
    explanations: {
      "den0 = [1 1 4]":
        "Type 0: No poles at origin. Denominator s² + s + 4. Has finite steady-state error for step input.",
      "den1 = [1 1 4 0]":
        "Type 1: One pole at s=0 (integrator). Denominator s³ + s² + 4s. Zero steady-state error for step.",
      "den2 = [1 1 4 0 0]":
        "Type 2: Two poles at s=0. Denominator s⁴ + s³ + 4s². Zero error for step and ramp.",
      "T0 = feedback(G0, 1)":
        "Closed-loop Type 0. Will have steady-state error to step input.",
      "T1 = feedback(G1, 1)":
        "Closed-loop Type 1. More oscillatory due to added integrator.",
      "T2 = feedback(G2, 1)":
        "Closed-loop Type 2. May be unstable! Check the response carefully.",
    },
  },
  {
    id: 5,
    title: "Bode Plot Analysis",
    objective:
      "Analyze frequency response using Bode plots and determine stability margins.",
    theory: `
            <h4>📐 Bode Plot Basics</h4>
            <p>Bode plot shows frequency response on logarithmic scale:</p>
            <ul>
                <li><strong>Magnitude Plot:</strong> 20·log₁₀|G(jω)| in dB vs log(ω)</li>
                <li><strong>Phase Plot:</strong> ∠G(jω) in degrees vs log(ω)</li>
            </ul>

            <h4>📊 Stability Margins</h4>
            <div class="formula-box">
                <strong>Gain Margin (GM):</strong> How much gain can increase before instability<br>
                Measured at phase = -180°
            </div>
            <div class="formula-box">
                <strong>Phase Margin (PM):</strong> How much phase lag can increase before instability<br>
                Measured at |G| = 0 dB (gain crossover frequency)
            </div>

            <h4>✅ Stability Criteria</h4>
            <ul>
                <li>System is stable if: <strong>GM > 0 dB</strong> AND <strong>PM > 0°</strong></li>
                <li>Good design: PM = 45° to 60°, GM > 6 dB</li>
            </ul>

            <div class="key-point">
                <strong>⚡ Quick Rule:</strong> At each pole, magnitude drops 20 dB/decade and phase drops 90°. Zeros have opposite effect.
            </div>
        `,
    code: `% Practical 5: Bode Plot and Stability Margins
% G(s) = (s+1) / [s(0.5s+1)]

num = [1 1];
den = conv([1 0], [0.5 1]);
G = tf(num, den);

figure(1);
bode(G);
title('Bode Plot');
grid on;

figure(2);
margin(G);
title('Bode Plot with Stability Margins');`,
    explanations: {
      "num = [1 1]":
        "Numerator (s+1) gives a zero at s = -1. Zeros add +20 dB/decade slope and +90° phase.",
      "den = conv([1 0], [0.5 1])":
        "Denominator s(0.5s+1) = 0.5s² + s. Integrator at origin and pole at s = -2.",
      "G = tf(num, den)": "Open-loop transfer function for frequency analysis.",
      "bode(G)":
        "Plots magnitude (dB) and phase (degrees) vs frequency (rad/s).",
      "margin(G)":
        "Calculates and displays Gain Margin (GM) and Phase Margin (PM) on Bode plot. Shows stability margins.",
    },
  },
  {
    id: 6,
    title: "Root Locus",
    objective:
      "Visualize how closed-loop poles move as gain K varies from 0 to ∞.",
    theory: `
            <h4>📐 What is Root Locus?</h4>
            <p>Root locus shows the path of closed-loop poles as gain K varies from 0 to ∞.</p>
            <div class="formula-box">$$1 + K \\cdot G(s)H(s) = 0$$</div>

            <h4>📋 Key Construction Rules</h4>
            <ol>
                <li><strong>Branches:</strong> Number of branches = Number of open-loop poles</li>
                <li><strong>Start/End:</strong> Starts at OL poles (K=0), ends at OL zeros (K=∞)</li>
                <li><strong>Real Axis:</strong> Exists to the LEFT of odd number of poles + zeros</li>
                <li><strong>Symmetry:</strong> Always symmetric about real axis</li>
                <li><strong>Asymptotes:</strong> If #poles > #zeros, branches go to infinity along asymptotes</li>
            </ol>

            <h4>🔑 Asymptote Formulas</h4>
            <div class="formula-box">$$\\sigma_a = \\frac{\\sum poles - \\sum zeros}{n - m}$$</div>
            <div class="formula-box">$$\\theta_a = \\frac{(2k+1) \\cdot 180°}{n - m}, \\quad k = 0, 1, 2...$$</div>

            <div class="key-point">
                <strong>⚡ Stability:</strong> System is stable when ALL branches are in Left Half Plane (LHP).
            </div>
        `,
    code: `% Practical 6: Root Locus Plot
% G(s) = (s+1) / [s(0.5s+1)]

num = [1 1];
den = conv([1 0], [0.5 1]);
G = tf(num, den);

rlocus(G);
title('Root Locus Plot');
grid on;`,
    explanations: {
      "num = [1 1]":
        "Zero at s = -1. Root locus branches will terminate here as K → ∞.",
      "den = conv([1 0], [0.5 1])":
        "Poles at s = 0 and s = -2. Root locus starts from these points at K = 0.",
      "G = tf(num, den)": "Open-loop transfer function G(s).",
      "rlocus(G)":
        "Plots root locus showing pole movement as K increases. Can find stable K range from this plot.",
    },
  },
  {
    id: 7,
    title: "Nyquist Plot",
    objective:
      "Use Nyquist criterion to determine closed-loop stability from open-loop frequency response.",
    theory: `
            <h4>📐 Nyquist Criterion</h4>
            <p>The Nyquist plot is G(jω) plotted on complex plane as ω varies from -∞ to +∞.</p>

            <h4>🔑 Nyquist Stability Formula</h4>
            <div class="formula-box">$$Z = N + P$$</div>
            <ul>
                <li><strong>Z:</strong> Number of closed-loop poles in RHP (unstable poles)</li>
                <li><strong>N:</strong> Number of clockwise encirclements of -1+j0</li>
                <li><strong>P:</strong> Number of open-loop poles in RHP</li>
            </ul>

            <div class="key-point">
                <strong>⚡ For Stability:</strong> Z must be 0, so N = -P<br>
                If open-loop is stable (P=0), Nyquist must NOT encircle -1.
            </div>

            <h4>📊 Reading the Plot</h4>
            <ul>
                <li>Critical point is <strong>-1 + j0</strong></li>
                <li>Clockwise encirclement = positive N</li>
                <li>Counter-clockwise encirclement = negative N</li>
                <li>Closer to -1 = smaller stability margins</li>
            </ul>
        `,
    code: `% Practical 7: Nyquist Plot
% G(s) = (s+2) / [(s+1)(s-1)]
% Note: Open-loop has pole at s=+1 (RHP) - unstable!

num = [1 2];
den = conv([1 1], [1 -1]);
G = tf(num, den);

nyquist(G);
title('Nyquist Plot');
grid on;`,
    explanations: {
      "num = [1 2]": "Zero at s = -2.",
      "den = conv([1 1], [1 -1])":
        "Poles at s = -1 and s = +1. One pole in RHP means P = 1 (open-loop unstable).",
      "G = tf(num, den)": "Open-loop transfer function with one unstable pole.",
      "nyquist(G)":
        "Plots Nyquist diagram. For stability with P=1, need exactly one counter-clockwise encirclement of -1.",
    },
  },
  {
    id: 8,
    title: "PI and PD Controller Effect",
    objective:
      "Investigate how PI and PD controllers affect system performance.",
    theory: `
            <h4>📐 PID Controller</h4>
            <div class="formula-box">$$G_c(s) = K_p + \\frac{K_i}{s} + K_d \\cdot s$$</div>

            <h4>🎛️ Controller Effects</h4>
            <table style="width:100%; border-collapse: collapse; margin: 16px 0;">
                <tr style="background: var(--surface);">
                    <th style="padding: 10px; border: 1px solid var(--border);">Control</th>
                    <th style="padding: 10px; border: 1px solid var(--border);">Effect</th>
                </tr>
                <tr>
                    <td style="padding: 10px; border: 1px solid var(--border);"><strong>P (Proportional)</strong></td>
                    <td style="padding: 10px; border: 1px solid var(--border);">Reduces error but cannot eliminate it. May increase overshoot.</td>
                </tr>
                <tr>
                    <td style="padding: 10px; border: 1px solid var(--border);"><strong>I (Integral)</strong></td>
                    <td style="padding: 10px; border: 1px solid var(--border);">Eliminates steady-state error. Adds pole at origin. May reduce stability.</td>
                </tr>
                <tr>
                    <td style="padding: 10px; border: 1px solid var(--border);"><strong>D (Derivative)</strong></td>
                    <td style="padding: 10px; border: 1px solid var(--border);">Adds damping, reduces overshoot. Adds a zero. Improves stability.</td>
                </tr>
            </table>

            <h4>🔧 PD Controller</h4>
            <div class="formula-box">$$G_c(s) = K_p + K_d s = K_d(s + \\frac{K_p}{K_d})$$</div>
            <p>Adds a zero at s = -Kp/Kd. This speeds up response and adds damping.</p>

            <div class="key-point">
                <strong>⚡ Design Tip:</strong> PD improves transient response. PI eliminates steady-state error. Use PID for both benefits.
            </div>
        `,
    code: `% Practical 8: Effect of PD Controller
% Plant: G(s) = 1/(s² + 10s + 20)

num = [1];
den = [1 10 20];
G = tf(num, den);
T_uncomp = feedback(G, 1);

% PD Controller: Gc(s) = Kd*s + Kp
Kp = 500;
Kd = 10;
num_pd = [Kd Kp];
G_pd = tf(conv(num_pd, num), den);
T_pd = feedback(G_pd, 1);

figure(1);
step(T_uncomp);
title('Uncompensated System');
grid on;

figure(2);
step(T_pd);
title('With PD Controller (Kp=500, Kd=10)');
grid on;`,
    explanations: {
      "den = [1 10 20]":
        "Plant denominator s² + 10s + 20. System poles at s = -5 ± j√(-5) (complex if discriminant < 0).",
      "T_uncomp = feedback(G, 1)":
        "Closed-loop without any controller - baseline response.",
      "Kp = 500; Kd = 10":
        "PD controller gains. Higher Kp = faster response, Kd = more damping.",
      "num_pd = [Kd Kp]": "PD controller: 10s + 500. Adds zero at s = -50.",
      "G_pd = tf(conv(num_pd, num), den)":
        "Compensated open-loop: Controller × Plant.",
      "T_pd = feedback(G_pd, 1)":
        "Closed-loop with PD. Compare overshoot, settling time with uncompensated system.",
    },
  },
  {
    id: 9,
    title: "Effect of Adding Zeros",
    objective:
      "Analyze how adding zeros to a system affects its time response.",
    theory: `
            <h4>📐 Effect of Zeros</h4>
            <p>Zeros in the transfer function significantly affect transient response.</p>

            <h4>🎯 Zero Location Effects</h4>
            <ul>
                <li><strong>LHP Zero (negative real):</strong> Speeds up response, may increase overshoot</li>
                <li><strong>Zero closer to origin:</strong> Larger effect on response</li>
                <li><strong>Zero near a pole:</strong> Pole-zero cancellation (reduces effect of that pole)</li>
                <li><strong>RHP Zero (positive real):</strong> Causes initial undershoot (non-minimum phase)</li>
            </ul>

            <h4>🔍 Mathematical Insight</h4>
            <div class="formula-box">
                Adding zero at s = -z:<br>
                $$G(s) = \\frac{(s+z) \\cdot N(s)}{D(s)}$$
            </div>
            <p>The (s+z) term adds derivative-like behavior, making response faster.</p>

            <div class="key-point">
                <strong>⚡ Rule of Thumb:</strong> A zero to the left of dominant poles speeds up response. A zero between poles and origin increases overshoot.
            </div>
        `,
    code: `% Practical 9: Effect of Adding Zeros
% Original: G(s) = 1/(s² + s)

n1 = [1];
d1 = [1 1 0];
G1 = tf(n1, d1);
T1 = feedback(G1, 1);

% Adding zero at s = -1/Tz = -2
Tz = 0.5;
Z1 = [Tz 1];
n2 = conv(n1, Z1);
G2 = tf(n2, d1);
T2 = feedback(G2, 1);

figure(1);
step(T1);
hold on;
step(T2);
title('Effect of Adding Zero');
legend('Without Zero', 'With Zero at s=-2');
grid on;`,
    explanations: {
      "d1 = [1 1 0]":
        "Denominator s² + s = s(s+1). Type 1 system with poles at s=0 and s=-1.",
      "T1 = feedback(G1, 1)":
        "Original closed-loop system without additional zero.",
      "Tz = 0.5": "Zero time constant. Zero will be at s = -1/Tz = -2.",
      "Z1 = [Tz 1]": "Zero polynomial: 0.5s + 1, giving zero at s = -2.",
      "n2 = conv(n1, Z1)": "New numerator with added zero.",
      "T2 = feedback(G2, 1)":
        "System with zero added. Expect faster response, possibly more overshoot.",
    },
  },
  {
    id: 10,
    title: "Effect of Adding Poles",
    objective:
      "Analyze how adding poles to a system affects its time response.",
    theory: `
            <h4>📐 Effect of Additional Poles</h4>
            <p>Adding poles to a system generally slows down the response.</p>

            <h4>🎯 Pole Location Effects</h4>
            <ul>
                <li><strong>Dominant Poles:</strong> Poles closest to imaginary axis - determine main response characteristics</li>
                <li><strong>Non-dominant Poles:</strong> Far in LHP - contribute fast-decaying modes</li>
                <li><strong>Additional Pole Effect:</strong> Increases rise time and settling time</li>
                <li><strong>May Reduce Overshoot:</strong> Extra pole adds more damping</li>
            </ul>

            <h4>🔍 Design Rule</h4>
            <div class="formula-box">
                For minimal effect on response, additional poles should be<br>
                <strong>5-10 times farther</strong> from jω axis than dominant poles.
            </div>

            <div class="key-point">
                <strong>⚡ Summary:</strong> Adding zeros speeds up response (may increase overshoot). Adding poles slows down response (may decrease overshoot).
            </div>
        `,
    code: `% Practical 10: Effect of Adding Poles
% Original: G(s) = 1/(s² + 2s)

n1 = [1];
d1 = [1 2 0];
G1 = tf(n1, d1);
T1 = feedback(G1, 1);

% Adding pole at s = -1/Tp = -1
Tp = 1;
P1 = [Tp 1];
d2 = conv(d1, P1);
G2 = tf(n1, d2);
T2 = feedback(G2, 1);

figure(1);
step(T1);
hold on;
step(T2);
title('Effect of Adding Pole');
legend('Without Extra Pole', 'With Pole at s=-1');
grid on;`,
    explanations: {
      "d1 = [1 2 0]":
        "Denominator s² + 2s = s(s+2). Type 1 system with poles at s=0 and s=-2.",
      "T1 = feedback(G1, 1)": "Original closed-loop without extra pole.",
      "Tp = 1": "Pole time constant. Pole will be at s = -1/Tp = -1.",
      "P1 = [Tp 1]": "Pole polynomial: s + 1, giving pole at s = -1.",
      "d2 = conv(d1, P1)": "New denominator with added pole.",
      "T2 = feedback(G2, 1)":
        "System with extra pole. Expect slower, more damped response.",
    },
  },
];

// ===== Control System Tutor Content =====
const TUTOR_TOPICS = [
  {
    id: 1,
    title: "Introduction",
    content: `
            <h3>Welcome to Control Systems! 🎓</h3>
            <p class="subtitle">Everything you need for your viva and practical</p>

            <h4>📚 What is a Control System?</h4>
            <p>A control system is a system that manages, commands, directs, or regulates the behavior of other systems to achieve a desired result.</p>

            <h4>🔄 Two Types of Control Systems</h4>
            <ul>
                <li><strong>Open-Loop System:</strong> Output has no effect on input. Example: Toaster, washing machine timer.</li>
                <li><strong>Closed-Loop (Feedback) System:</strong> Output is measured and compared with input. Example: AC thermostat, cruise control.</li>
            </ul>

            <div class="viva-question">
                <strong>Q: What is the advantage of closed-loop over open-loop?</strong>
                <p>A: Closed-loop systems are less sensitive to disturbances and parameter variations. They can automatically correct errors.</p>
            </div>

            <div class="viva-question">
                <strong>Q: Give a real-world example of feedback control.</strong>
                <p>A: Room temperature control - AC measures current temperature (output), compares with set point (input), and adjusts cooling accordingly.</p>
            </div>
        `,
  },
  {
    id: 2,
    title: "Transfer Functions",
    content: `
            <h3>Transfer Functions 📐</h3>
            <p class="subtitle">The mathematical model of LTI systems</p>

            <h4>📌 Definition</h4>
            <p>Transfer Function is the ratio of Laplace transform of output to input, assuming zero initial conditions.</p>
            <div class="formula-box">$$G(s) = \\frac{Y(s)}{X(s)} = \\frac{\\text{Output}}{\\text{Input}}$$</div>

            <h4>📝 How to Find Transfer Function</h4>
            <ol>
                <li>Write differential equation of the system</li>
                <li>Take Laplace transform (assume zero initial conditions)</li>
                <li>Find ratio Y(s)/X(s)</li>
            </ol>

            <h4>💻 MATLAB Commands</h4>
            <pre>num = [b2 b1 b0];  % Numerator coefficients
den = [a2 a1 a0];  % Denominator coefficients
G = tf(num, den);  % Create transfer function</pre>

            <div class="viva-question">
                <strong>Q: What are the limitations of transfer functions?</strong>
                <p>A: Only valid for linear, time-invariant (LTI) systems. Cannot handle nonlinear systems or systems with time-varying parameters. Assumes zero initial conditions.</p>
            </div>

            <div class="viva-question">
                <strong>Q: What does the order of a system mean?</strong>
                <p>A: Order = highest power of s in denominator = number of poles = number of energy storage elements in the system.</p>
            </div>
        `,
  },
  {
    id: 3,
    title: "Poles & Zeros",
    content: `
            <h3>Poles and Zeros 🎯</h3>
            <p class="subtitle">The DNA of system behavior</p>

            <h4>📌 Definitions</h4>
            <ul>
                <li><strong>Poles:</strong> Values of s where G(s) → ∞ (roots of denominator)</li>
                <li><strong>Zeros:</strong> Values of s where G(s) = 0 (roots of numerator)</li>
            </ul>

            <h4>⚡ Stability from Poles</h4>
            <div class="key-point">
                <strong>CRITICAL RULE:</strong><br>
                • All poles in LHP (negative real part) → STABLE ✅<br>
                • Any pole in RHP (positive real part) → UNSTABLE ❌<br>
                • Poles on imaginary axis → MARGINALLY STABLE ⚠️
            </div>

            <h4>📊 Pole Locations and Response</h4>
            <ul>
                <li><strong>Real negative pole:</strong> Exponential decay e^(-at)</li>
                <li><strong>Real positive pole:</strong> Exponential growth e^(+at) - UNSTABLE</li>
                <li><strong>Complex poles:</strong> Oscillatory response with decay/growth depending on real part</li>
                <li><strong>Imaginary poles:</strong> Sustained oscillation (marginally stable)</li>
            </ul>

            <div class="viva-question">
                <strong>Q: How do zeros affect system response?</strong>
                <p>A: Zeros don't affect stability but change the shape of transient response. Zeros in LHP speed up response but may increase overshoot. RHP zeros cause initial undershoot.</p>
            </div>

            <h4>💻 MATLAB Command</h4>
            <pre>pzmap(G);  % Plots poles (x) and zeros (o) on complex plane</pre>
        `,
  },
  {
    id: 4,
    title: "Time Response",
    content: `
            <h3>Time Domain Response ⏱️</h3>
            <p class="subtitle">How systems behave over time</p>

            <h4>📊 Standard Test Signals</h4>
            <ul>
                <li><strong>Impulse:</strong> δ(t) - Tests natural response</li>
                <li><strong>Step:</strong> u(t) - Most common test, shows steady-state behavior</li>
                <li><strong>Ramp:</strong> t·u(t) - Tests ability to track changing inputs</li>
            </ul>

            <h4>📏 Time Domain Specifications</h4>
            <ul>
                <li><strong>Rise Time (tr):</strong> Time from 10% to 90% of final value</li>
                <li><strong>Peak Time (tp):</strong> Time to reach first peak</li>
                <li><strong>Settling Time (ts):</strong> Time to stay within ±2% (or ±5%) of final value</li>
                <li><strong>Peak Overshoot (Mp):</strong> Maximum deviation above final value</li>
            </ul>

            <h4>🔢 Formulas for 2nd Order Underdamped System</h4>
            <div class="formula-box">$$M_p = e^{\\frac{-\\pi\\zeta}{\\sqrt{1-\\zeta^2}}} \\times 100\\%$$</div>
            <div class="formula-box">$$t_s = \\frac{4}{\\zeta\\omega_n} \\text{ (2% criterion)}$$</div>
            <div class="formula-box">$$t_p = \\frac{\\pi}{\\omega_d} = \\frac{\\pi}{\\omega_n\\sqrt{1-\\zeta^2}}$$</div>

            <div class="viva-question">
                <strong>Q: How does damping ratio affect overshoot?</strong>
                <p>A: Higher damping ratio (ζ) → Lower overshoot. At ζ=1, no overshoot (critically damped). For ζ=0.707, Mp ≈ 4.3% (often used as design target).</p>
            </div>
        `,
  },
  {
    id: 5,
    title: "Steady-State Error",
    content: `
            <h3>Steady-State Error 🎯</h3>
            <p class="subtitle">How accurately can the system track inputs?</p>

            <h4>📌 Definition</h4>
            <p>Steady-state error (ess) is the difference between desired output and actual output as t → ∞.</p>
            <div class="formula-box">$$e_{ss} = \\lim_{t \\to \\infty} e(t) = \\lim_{s \\to 0} s \\cdot E(s)$$</div>

            <h4>📊 System Type</h4>
            <p><strong>Type N</strong> = Number of poles at s=0 in open-loop transfer function</p>

            <h4>🔑 Error Constants</h4>
            <ul>
                <li><strong>Position constant:</strong> Kp = lim(s→0) G(s)</li>
                <li><strong>Velocity constant:</strong> Kv = lim(s→0) s·G(s)</li>
                <li><strong>Acceleration constant:</strong> Ka = lim(s→0) s²·G(s)</li>
            </ul>

            <h4>📋 Error Table (MEMORIZE THIS!)</h4>
            <table style="width:100%; border-collapse: collapse; margin: 12px 0; font-size: 0.9rem;">
                <tr style="background: var(--surface);">
                    <th style="padding: 8px; border: 1px solid var(--border);">Input</th>
                    <th style="padding: 8px; border: 1px solid var(--border);">Type 0</th>
                    <th style="padding: 8px; border: 1px solid var(--border);">Type 1</th>
                    <th style="padding: 8px; border: 1px solid var(--border);">Type 2</th>
                </tr>
                <tr>
                    <td style="padding: 8px; border: 1px solid var(--border);">Step (1/s)</td>
                    <td style="padding: 8px; border: 1px solid var(--border);">1/(1+Kp)</td>
                    <td style="padding: 8px; border: 1px solid var(--border);">0</td>
                    <td style="padding: 8px; border: 1px solid var(--border);">0</td>
                </tr>
                <tr>
                    <td style="padding: 8px; border: 1px solid var(--border);">Ramp (1/s²)</td>
                    <td style="padding: 8px; border: 1px solid var(--border);">∞</td>
                    <td style="padding: 8px; border: 1px solid var(--border);">1/Kv</td>
                    <td style="padding: 8px; border: 1px solid var(--border);">0</td>
                </tr>
                <tr>
                    <td style="padding: 8px; border: 1px solid var(--border);">Parabola (1/s³)</td>
                    <td style="padding: 8px; border: 1px solid var(--border);">∞</td>
                    <td style="padding: 8px; border: 1px solid var(--border);">∞</td>
                    <td style="padding: 8px; border: 1px solid var(--border);">1/Ka</td>
                </tr>
            </table>

            <div class="viva-question">
                <strong>Q: How to reduce steady-state error?</strong>
                <p>A: 1) Increase system gain, 2) Add integrator (increases type), 3) Use integral controller (PI or PID)</p>
            </div>
        `,
  },
  {
    id: 6,
    title: "Stability Analysis",
    content: `
            <h3>Stability Analysis 🔒</h3>
            <p class="subtitle">Will the system blow up or settle down?</p>

            <h4>📌 BIBO Stability</h4>
            <p><strong>Bounded Input → Bounded Output</strong>: If every bounded input produces bounded output, system is BIBO stable.</p>

            <h4>⚡ Stability Conditions</h4>
            <div class="key-point">
                A system is stable if and only if <strong>ALL poles of the closed-loop transfer function have negative real parts</strong> (lie in LHP).
            </div>

            <h4>📊 Methods to Check Stability</h4>
            <ol>
                <li><strong>Direct:</strong> Find poles, check if all in LHP</li>
                <li><strong>Routh-Hurwitz:</strong> Algebraic test without finding roots</li>
                <li><strong>Root Locus:</strong> Graphical method for varying gain</li>
                <li><strong>Bode Plot:</strong> Check gain and phase margins</li>
                <li><strong>Nyquist:</strong> Check encirclements of -1</li>
            </ol>

            <h4>📝 Routh-Hurwitz Quick Rules</h4>
            <ul>
                <li>All coefficients of characteristic equation must be positive</li>
                <li>All elements in first column of Routh array must be positive</li>
                <li>Number of sign changes = Number of RHP poles</li>
            </ul>

            <div class="viva-question">
                <strong>Q: What is marginal stability?</strong>
                <p>A: When poles are on the imaginary axis (not in RHP or LHP). System oscillates with constant amplitude - neither grows nor decays.</p>
            </div>
        `,
  },
  {
    id: 7,
    title: "Root Locus",
    content: `
            <h3>Root Locus Method 📈</h3>
            <p class="subtitle">How do poles move as gain changes?</p>

            <h4>📌 What is Root Locus?</h4>
            <p>A plot showing the paths of closed-loop poles as gain K varies from 0 to ∞.</p>
            <div class="formula-box">$$1 + K \\cdot G(s)H(s) = 0$$</div>

            <h4>📋 Construction Rules (MEMORIZE!)</h4>
            <ol>
                <li><strong>Number of branches</strong> = Number of poles</li>
                <li><strong>Start points (K=0):</strong> Open-loop poles</li>
                <li><strong>End points (K=∞):</strong> Open-loop zeros (or infinity)</li>
                <li><strong>Real axis:</strong> Locus exists to LEFT of ODD number of poles+zeros</li>
                <li><strong>Symmetry:</strong> About real axis</li>
                <li><strong>Asymptotes:</strong> θ = (2k+1)×180°/(n-m), k = 0,1,2...</li>
                <li><strong>Centroid:</strong> σ = (Σpoles - Σzeros)/(n-m)</li>
            </ol>

            <h4>🎯 Using Root Locus</h4>
            <ul>
                <li>Find range of K for stability (all branches in LHP)</li>
                <li>Find K for desired pole locations</li>
                <li>Analyze effect of adding poles/zeros</li>
            </ul>

            <div class="viva-question">
                <strong>Q: What happens at breakaway/break-in points?</strong>
                <p>A: Branches leave (breakaway) or enter (break-in) the real axis. Found by solving dK/ds = 0.</p>
            </div>

            <h4>💻 MATLAB</h4>
            <pre>rlocus(G);  % Plot root locus
rlocfind(G);  % Click on plot to find K value</pre>
        `,
  },
  {
    id: 8,
    title: "Bode Plots",
    content: `
            <h3>Bode Plot Analysis 📊</h3>
            <p class="subtitle">Frequency response made visual</p>

            <h4>📌 What is a Bode Plot?</h4>
            <p>Two plots showing frequency response:</p>
            <ul>
                <li><strong>Magnitude:</strong> 20·log₁₀|G(jω)| in dB vs log(ω)</li>
                <li><strong>Phase:</strong> ∠G(jω) in degrees vs log(ω)</li>
            </ul>

            <h4>📝 Bode Plot Sketching Rules</h4>
            <table style="width:100%; border-collapse: collapse; margin: 12px 0; font-size: 0.85rem;">
                <tr style="background: var(--surface);">
                    <th style="padding: 8px; border: 1px solid var(--border);">Term</th>
                    <th style="padding: 8px; border: 1px solid var(--border);">Magnitude</th>
                    <th style="padding: 8px; border: 1px solid var(--border);">Phase</th>
                </tr>
                <tr>
                    <td style="padding: 8px; border: 1px solid var(--border);">K (gain)</td>
                    <td style="padding: 8px; border: 1px solid var(--border);">20·log(K) constant</td>
                    <td style="padding: 8px; border: 1px solid var(--border);">0°</td>
                </tr>
                <tr>
                    <td style="padding: 8px; border: 1px solid var(--border);">s (zero at origin)</td>
                    <td style="padding: 8px; border: 1px solid var(--border);">+20 dB/decade</td>
                    <td style="padding: 8px; border: 1px solid var(--border);">+90°</td>
                </tr>
                <tr>
                    <td style="padding: 8px; border: 1px solid var(--border);">1/s (pole at origin)</td>
                    <td style="padding: 8px; border: 1px solid var(--border);">-20 dB/decade</td>
                    <td style="padding: 8px; border: 1px solid var(--border);">-90°</td>
                </tr>
                <tr>
                    <td style="padding: 8px; border: 1px solid var(--border);">(1+s/ω) zero</td>
                    <td style="padding: 8px; border: 1px solid var(--border);">+20 dB/dec after ω</td>
                    <td style="padding: 8px; border: 1px solid var(--border);">0° to +90°</td>
                </tr>
                <tr>
                    <td style="padding: 8px; border: 1px solid var(--border);">1/(1+s/ω) pole</td>
                    <td style="padding: 8px; border: 1px solid var(--border);">-20 dB/dec after ω</td>
                    <td style="padding: 8px; border: 1px solid var(--border);">0° to -90°</td>
                </tr>
            </table>

            <h4>⚡ Stability Margins</h4>
            <div class="key-point">
                <strong>Gain Margin (GM):</strong> Gain increase possible before instability. Measured where phase = -180°.<br>
                <strong>Phase Margin (PM):</strong> Phase decrease possible before instability. Measured where |G| = 0 dB.<br>
                <strong>For stability:</strong> GM > 0 dB AND PM > 0°
            </div>

            <div class="viva-question">
                <strong>Q: What is a good phase margin for design?</strong>
                <p>A: PM = 45° to 60° provides good stability with reasonable transient response. PM < 30° gives excessive overshoot.</p>
            </div>
        `,
  },
  {
    id: 9,
    title: "Nyquist Criterion",
    content: `
            <h3>Nyquist Stability Criterion 🔄</h3>
            <p class="subtitle">Stability from encirclements</p>

            <h4>📌 What is Nyquist Plot?</h4>
            <p>Plot of G(jω) on complex plane as ω varies from -∞ to +∞.</p>

            <h4>🔑 Nyquist Criterion</h4>
            <div class="formula-box" style="font-size: 1.1em;">$$Z = N + P$$</div>
            <ul>
                <li><strong>Z:</strong> Number of closed-loop RHP poles (unstable)</li>
                <li><strong>N:</strong> Clockwise encirclements of -1+j0</li>
                <li><strong>P:</strong> Open-loop RHP poles</li>
            </ul>

            <div class="key-point">
                <strong>For Stability: Z = 0</strong><br>
                • If P = 0 (OL stable): N must be 0 (no encirclement of -1)<br>
                • If P > 0 (OL unstable): N must be -P (counter-clockwise encirclements)
            </div>

            <h4>📊 Reading the Plot</h4>
            <ul>
                <li>Critical point: -1 + j0</li>
                <li>Distance from -1 indicates stability margin</li>
                <li>Clockwise = positive N</li>
                <li>Counter-clockwise = negative N</li>
            </ul>

            <div class="viva-question">
                <strong>Q: Why is -1 the critical point?</strong>
                <p>A: At -1+j0, G(jω) = -1, so 1+G(jω) = 0, which is the condition for closed-loop poles (instability).</p>
            </div>

            <h4>💻 MATLAB</h4>
            <pre>nyquist(G);  % Plot Nyquist diagram</pre>
        `,
  },
  {
    id: 10,
    title: "PID Controllers",
    content: `
            <h3>PID Controllers 🎛️</h3>
            <p class="subtitle">The workhorse of industrial control</p>

            <h4>📌 PID Transfer Function</h4>
            <div class="formula-box">$$G_c(s) = K_p + \\frac{K_i}{s} + K_d s = \\frac{K_d s^2 + K_p s + K_i}{s}$$</div>

            <h4>🎯 Effect of Each Term</h4>
            <table style="width:100%; border-collapse: collapse; margin: 12px 0; font-size: 0.85rem;">
                <tr style="background: var(--surface);">
                    <th style="padding: 8px; border: 1px solid var(--border);">Term</th>
                    <th style="padding: 8px; border: 1px solid var(--border);">Rise Time</th>
                    <th style="padding: 8px; border: 1px solid var(--border);">Overshoot</th>
                    <th style="padding: 8px; border: 1px solid var(--border);">Settling</th>
                    <th style="padding: 8px; border: 1px solid var(--border);">SS Error</th>
                </tr>
                <tr>
                    <td style="padding: 8px; border: 1px solid var(--border);">↑ Kp</td>
                    <td style="padding: 8px; border: 1px solid var(--border);">↓</td>
                    <td style="padding: 8px; border: 1px solid var(--border);">↑</td>
                    <td style="padding: 8px; border: 1px solid var(--border);">Small Δ</td>
                    <td style="padding: 8px; border: 1px solid var(--border);">↓</td>
                </tr>
                <tr>
                    <td style="padding: 8px; border: 1px solid var(--border);">↑ Ki</td>
                    <td style="padding: 8px; border: 1px solid var(--border);">↓</td>
                    <td style="padding: 8px; border: 1px solid var(--border);">↑</td>
                    <td style="padding: 8px; border: 1px solid var(--border);">↑</td>
                    <td style="padding: 8px; border: 1px solid var(--border);">Eliminates</td>
                </tr>
                <tr>
                    <td style="padding: 8px; border: 1px solid var(--border);">↑ Kd</td>
                    <td style="padding: 8px; border: 1px solid var(--border);">Small Δ</td>
                    <td style="padding: 8px; border: 1px solid var(--border);">↓</td>
                    <td style="padding: 8px; border: 1px solid var(--border);">↓</td>
                    <td style="padding: 8px; border: 1px solid var(--border);">No effect</td>
                </tr>
            </table>

            <h4>📊 Common Configurations</h4>
            <ul>
                <li><strong>P only:</strong> Simple but leaves steady-state error</li>
                <li><strong>PI:</strong> Eliminates SS error, good for systems without noise</li>
                <li><strong>PD:</strong> Improves transient response, reduces overshoot</li>
                <li><strong>PID:</strong> Best of all - eliminates error AND improves transients</li>
            </ul>

            <div class="viva-question">
                <strong>Q: Why is derivative control not used alone?</strong>
                <p>A: D-controller produces no output for constant error. It only reacts to rate of change. Also amplifies high-frequency noise.</p>
            </div>

            <div class="viva-question">
                <strong>Q: What does integral windup mean?</strong>
                <p>A: When actuator saturates, integral term keeps accumulating, causing large overshoot when error changes sign. Use anti-windup schemes.</p>
            </div>
        `,
  },
  {
    id: 11,
    title: "Compensators",
    content: `
            <h3>Lead & Lag Compensators ⚙️</h3>
            <p class="subtitle">Improving system performance</p>

            <h4>📌 Lead Compensator</h4>
            <div class="formula-box">$$G_c(s) = K_c \\frac{s + z}{s + p}, \\quad |z| < |p|$$</div>
            <p>Zero closer to origin than pole. Adds phase lead → improves stability.</p>
            <ul>
                <li>Increases phase margin</li>
                <li>Increases bandwidth (faster response)</li>
                <li>May increase noise sensitivity</li>
            </ul>

            <h4>📌 Lag Compensator</h4>
            <div class="formula-box">$$G_c(s) = K_c \\frac{s + z}{s + p}, \\quad |z| > |p|$$</div>
            <p>Pole closer to origin than zero. Increases low-frequency gain.</p>
            <ul>
                <li>Reduces steady-state error</li>
                <li>Decreases bandwidth (slower response)</li>
                <li>May reduce stability margin</li>
            </ul>

            <div class="viva-question">
                <strong>Q: When to use lead vs lag?</strong>
                <p>A: Use LEAD to improve transient response and stability margins. Use LAG to improve steady-state accuracy. Use LEAD-LAG for both benefits.</p>
            </div>
        `,
  },
  {
    id: 12,
    title: "Viva Questions",
    content: `
            <h3>Common Viva Questions 💬</h3>
            <p class="subtitle">Be prepared for these!</p>

            <div class="viva-question">
                <strong>Q: What is the difference between open-loop and closed-loop systems?</strong>
                <p>A: Open-loop has no feedback - output doesn't affect input. Closed-loop uses feedback to compare output with desired input and correct errors.</p>
            </div>

            <div class="viva-question">
                <strong>Q: What is the characteristic equation?</strong>
                <p>A: 1 + G(s)H(s) = 0, or equivalently, the denominator of closed-loop transfer function. Its roots are the closed-loop poles.</p>
            </div>

            <div class="viva-question">
                <strong>Q: Why do we use Laplace transform in control systems?</strong>
                <p>A: It converts differential equations to algebraic equations, making analysis easier. It also provides insight into frequency response and stability.</p>
            </div>

            <div class="viva-question">
                <strong>Q: What is the significance of ζ = 0.707?</strong>
                <p>A: It gives approximately 5% overshoot and is often considered optimal - good balance between speed and overshoot. Also gives PM ≈ 65°.</p>
            </div>

            <div class="viva-question">
                <strong>Q: How do you determine system stability from transfer function?</strong>
                <p>A: Find poles (roots of denominator). If ALL poles have negative real parts (in LHP), system is stable.</p>
            </div>

            <div class="viva-question">
                <strong>Q: What is gain crossover frequency?</strong>
                <p>A: Frequency where |G(jω)| = 1 (0 dB). Phase margin is measured here.</p>
            </div>

            <div class="viva-question">
                <strong>Q: What is phase crossover frequency?</strong>
                <p>A: Frequency where phase = -180°. Gain margin is measured here.</p>
            </div>

            <div class="viva-question">
                <strong>Q: What happens if you increase the gain K?</strong>
                <p>A: Reduces steady-state error but may reduce stability (lower gain/phase margins). Root locus moves outward.</p>
            </div>

            <div class="key-point">
                <strong>Pro Tip:</strong> Always relate your answer to the specific practical you did. Mention what plots you generated and what you observed!
            </div>
        `,
  },
];

// ===== Application State =====
let state = {
  currentPractical: null,
  currentTutorTopic: 0,
  explainMode: false,
  sidebarOpen: false,
  isInitialized: false,
};

// ===== DOM Elements =====
const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => document.querySelectorAll(selector);

// ===== Initialize Application =====
document.addEventListener("DOMContentLoaded", () => {
  initApp();
});

function initApp() {
  // On mobile, ensure sidebar starts closed
  // On desktop, sidebar is visible by default (no collapsed class)
  if (window.innerWidth <= 768) {
    closeSidebar();
  } else {
    // Desktop: sidebar visible by default
    state.sidebarOpen = true;
  }

  renderPracticalsList();
  setupEventListeners();
  updateLineNumbers();
  renderTutorTopics();

  // Handle window resize - close mobile sidebar when resizing to desktop
  window.addEventListener("resize", () => {
    if (window.innerWidth > 768 && state.sidebarOpen) {
      closeSidebar();
    }
  });

  // Initialize KaTeX rendering
  if (typeof renderMathInElement !== "undefined") {
    setTimeout(() => {
      document
        .querySelectorAll(".theory-container, .tutor-content")
        .forEach((el) => {
          renderMathInElement(el, {
            delimiters: [
              { left: "$$", right: "$$", display: true },
              { left: "$", right: "$", display: false },
            ],
          });
        });
    }, 100);
  }

  // Mark as initialized
  state.isInitialized = true;

  // Sync line numbers on load
  syncLineNumberScroll();
}

// Sync line numbers scroll position with editor
function syncLineNumberScroll() {
  const editor = $("#code-editor");
  const lineNumbers = $("#line-numbers");
  if (editor && lineNumbers) {
    lineNumbers.scrollTop = editor.scrollTop;
  }
}

// ===== Render Functions =====
function renderPracticalsList() {
  const list = $("#practicals-list");
  list.innerHTML = PRACTICALS.map(
    (p) => `
        <li data-id="${p.id}">
            <span class="practical-num">${p.id}</span>
            <span class="practical-title">${p.title}</span>
        </li>
    `,
  ).join("");
}

function renderTutorTopics() {
  const container = $("#tutor-topics");
  container.innerHTML = TUTOR_TOPICS.map(
    (t, i) => `
        <button class="topic-btn ${i === 0 ? "active" : ""}" data-index="${i}">
            ${t.title}
        </button>
    `,
  ).join("");
}

function renderTutorContent(index) {
  const topic = TUTOR_TOPICS[index];
  const container = $("#tutor-content");
  container.innerHTML = topic.content;

  // Update progress
  const progress = ((index + 1) / TUTOR_TOPICS.length) * 100;
  $("#tutor-progress").style.width = `${progress}%`;

  // Update page indicator
  $("#tutor-page").textContent = `${index + 1} / ${TUTOR_TOPICS.length}`;

  // Update active topic button
  $$(".topic-btn").forEach((btn, i) => {
    btn.classList.toggle("active", i === index);
    if (i < index) btn.classList.add("completed");
  });

  // Render math
  if (typeof renderMathInElement !== "undefined") {
    renderMathInElement(container, {
      delimiters: [
        { left: "$$", right: "$$", display: true },
        { left: "$", right: "$", display: false },
      ],
    });
  }
}

function renderTheory() {
  const container = $("#theory-content");
  if (!state.currentPractical) {
    container.innerHTML = `
            <div class="empty-state">
                <div class="empty-icon">📖</div>
                <h3>Select a Practical</h3>
                <p>Choose a practical from the sidebar to see theory and explanations</p>
            </div>
        `;
    return;
  }

  const p = state.currentPractical;
  const explanationsHtml = Object.entries(p.explanations)
    .map(
      ([code, explanation]) => `
        <div class="explanation-card">
            <code>${escapeHtml(code)}</code>
            <p>${explanation}</p>
        </div>
    `,
    )
    .join("");

  container.innerHTML = `
        <div class="theory-section">
            <h3>🎯 Objective</h3>
            <p>${p.objective}</p>
        </div>
        <div class="theory-section">
            <h3>📖 Theory</h3>
            <div class="theory-text">${p.theory}</div>
        </div>
        <div class="theory-section">
            <h3>💻 Code Explanations</h3>
            ${explanationsHtml}
        </div>
    `;

  // Render math if KaTeX is available
  if (typeof renderMathInElement !== "undefined") {
    renderMathInElement(container, {
      delimiters: [
        { left: "$$", right: "$$", display: true },
        { left: "$", right: "$", display: false },
      ],
    });
  }
}

function renderExplanations() {
  const container = $("#explain-content");
  const code = $("#code-editor").value;
  const lines = code
    .split("\n")
    .filter((l) => l.trim() && !l.trim().startsWith("%"));

  if (lines.length === 0) {
    container.innerHTML =
      '<p class="explain-hint">Add some code to see explanations</p>';
    return;
  }

  const explanations = state.currentPractical?.explanations || {};
  let html = "";

  lines.forEach((line) => {
    const trimmedLine = line.trim().replace(/;$/, "");
    let explanation = "MATLAB command for control system analysis.";

    // Check current practical explanations
    for (const [key, value] of Object.entries(explanations)) {
      if (
        trimmedLine.includes(key.replace(/;$/, "")) ||
        key.replace(/;$/, "").includes(trimmedLine)
      ) {
        explanation = value;
        break;
      }
    }

    // Generic explanations
    if (explanation === "MATLAB command for control system analysis.") {
      explanation = getGenericExplanation(trimmedLine);
    }

    html += `
            <div class="explain-card">
                <code>${escapeHtml(trimmedLine)}</code>
                <p>${explanation}</p>
            </div>
        `;
  });

  container.innerHTML = html;
}

function getGenericExplanation(line) {
  const lower = line.toLowerCase();
  if (lower.includes("tf("))
    return "Creates a transfer function from numerator and denominator coefficients.";
  if (lower.includes("feedback("))
    return "Creates closed-loop system. feedback(G,1) gives unity feedback: T = G/(1+G).";
  if (lower.includes("conv("))
    return "Multiplies two polynomials. Used to expand expressions like (s+a)(s+b).";
  if (lower.includes("step("))
    return "Plots step response - system output when input changes from 0 to 1.";
  if (lower.includes("impulse("))
    return "Plots impulse response - natural behavior of the system.";
  if (lower.includes("bode("))
    return "Plots Bode diagram - magnitude and phase vs frequency.";
  if (lower.includes("margin("))
    return "Calculates and displays gain margin and phase margin.";
  if (lower.includes("rlocus("))
    return "Plots root locus - shows how poles move as gain K varies.";
  if (lower.includes("nyquist("))
    return "Plots Nyquist diagram for stability analysis.";
  if (lower.includes("pzmap("))
    return "Plots poles (×) and zeros (○) on complex plane.";
  if (lower.includes("figure"))
    return "Creates a new figure window for plotting.";
  if (lower.includes("grid on")) return "Adds grid lines to the current plot.";
  if (lower.includes("title(")) return "Sets the title of the current plot.";
  if (lower.includes("hold on"))
    return "Keeps current plot so next plot overlays on same axes.";
  if (lower.includes("=") && lower.includes("["))
    return "Defines polynomial coefficients in descending powers of s.";
  if (lower.includes("=")) return "Assigns a value to a variable.";
  return "MATLAB command for control system analysis.";
}

// ===== Event Listeners =====
function setupEventListeners() {
  // Sidebar toggle - mobile and desktop
  $("#menu-toggle").addEventListener("click", toggleSidebar);
  $("#sidebar-overlay").addEventListener("click", closeSidebar);
  $("#sidebar-close").addEventListener("click", closeSidebar);

  // Desktop sidebar toggle button
  const sidebarToggle = $("#sidebar-toggle");
  if (sidebarToggle) {
    sidebarToggle.addEventListener("click", toggleSidebar);
  }

  // Practicals list
  $("#practicals-list").addEventListener("click", (e) => {
    const li = e.target.closest("li");
    if (li) {
      const id = parseInt(li.dataset.id);
      selectPractical(id);
      closeSidebar();
    }
  });

  // Quick reference clicks
  $$(".ref-item").forEach((item) => {
    item.addEventListener("click", () => {
      const cmd = item.dataset.cmd;
      const editor = $("#code-editor");
      editor.value += (editor.value ? "\n" : "") + cmd + ";";
      updateLineNumbers();
      closeSidebar();
    });
  });

  // Run button
  $("#run-btn").addEventListener("click", runCode);
  $("#mobile-run").addEventListener("click", runCode);

  // Clear button
  $("#clear-btn").addEventListener("click", clearEditor);

  // Code editor
  const editor = $("#code-editor");
  editor.addEventListener("input", () => {
    updateLineNumbers();
    if (state.explainMode) renderExplanations();
  });
  editor.addEventListener("scroll", () => {
    const lineNumbers = $("#line-numbers");
    if (lineNumbers) {
      lineNumbers.scrollTop = editor.scrollTop;
    }
  });
  editor.addEventListener("keydown", (e) => {
    if (e.key === "Tab") {
      e.preventDefault();
      const start = editor.selectionStart;
      const end = editor.selectionEnd;
      editor.value =
        editor.value.substring(0, start) + "    " + editor.value.substring(end);
      editor.selectionStart = editor.selectionEnd = start + 4;
    }
  });

  // Keyboard shortcuts
  document.addEventListener("keydown", (e) => {
    // Run code: Ctrl/Cmd + Enter
    if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
      e.preventDefault();
      runCode();
    }

    // Show shortcuts: ? key (when not typing in editor)
    if (e.key === "?" && document.activeElement !== $("#code-editor")) {
      e.preventDefault();
      openShortcuts();
    }

    // Escape key: Close sidebar, modals, fullscreen
    if (e.key === "Escape") {
      // Close shortcuts modal if open
      const shortcutsModal = $("#shortcuts-modal");
      if (shortcutsModal && shortcutsModal.classList.contains("active")) {
        closeShortcuts();
        return;
      }

      // Close sidebar if open
      if (state.sidebarOpen) {
        closeSidebar();
        return;
      }

      // Close tutor modal if open
      const tutorModal = $("#tutor-modal");
      if (tutorModal && tutorModal.classList.contains("active")) {
        closeTutor();
        return;
      }

      // Close explain sidebar if open
      if (state.explainMode) {
        state.explainMode = false;
        $("#explain-toggle").checked = false;
        $("#explain-sidebar").classList.remove("open");
        return;
      }

      // Exit fullscreen editor if active
      const editorPanel = $(".editor-panel");
      if (editorPanel && editorPanel.classList.contains("fullscreen")) {
        editorPanel.classList.remove("fullscreen");
        return;
      }
    }

    // Toggle sidebar: Ctrl/Cmd + B
    if ((e.ctrlKey || e.metaKey) && (e.key === "b" || e.key === "B")) {
      e.preventDefault();
      toggleSidebar();
    }

    // Clear editor: Ctrl/Cmd + Shift + Delete
    if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === "Delete") {
      e.preventDefault();
      clearEditor();
    }
  });

  // Shortcuts modal
  const shortcutsBtn = $("#shortcuts-btn");
  if (shortcutsBtn) {
    shortcutsBtn.addEventListener("click", openShortcuts);
  }

  const closeShortcutsBtn = $("#close-shortcuts");
  if (closeShortcutsBtn) {
    closeShortcutsBtn.addEventListener("click", closeShortcuts);
  }

  const shortcutsModal = $("#shortcuts-modal");
  if (shortcutsModal) {
    shortcutsModal.addEventListener("click", (e) => {
      if (e.target === shortcutsModal) closeShortcuts();
    });
  }

  // Tabs
  $("#output-tabs").addEventListener("click", (e) => {
    const tab = e.target.closest(".tab");
    if (tab) {
      const tabName = tab.dataset.tab;
      switchTab(tabName);
    }
  });

  // Explain mode toggle
  $("#explain-toggle").addEventListener("change", (e) => {
    state.explainMode = e.target.checked;
    $("#explain-sidebar").classList.toggle("open", state.explainMode);
    if (state.explainMode) renderExplanations();
  });

  $("#close-explain").addEventListener("click", () => {
    state.explainMode = false;
    $("#explain-toggle").checked = false;
    $("#explain-sidebar").classList.remove("open");
  });

  // Copy code button
  $("#copy-code").addEventListener("click", () => {
    navigator.clipboard.writeText($("#code-editor").value);
    showToast("Code copied to clipboard", "success");
  });

  // Fullscreen editor
  $("#fullscreen-editor").addEventListener("click", () => {
    $(".editor-panel").classList.toggle("fullscreen");
  });

  // Tutor modal
  $("#tutor-btn").addEventListener("click", openTutor);
  $("#close-tutor").addEventListener("click", closeTutor);
  $("#tutor-modal").addEventListener("click", (e) => {
    if (e.target === $("#tutor-modal")) closeTutor();
  });

  // Tutor navigation
  $("#tutor-prev").addEventListener("click", () => {
    if (state.currentTutorTopic > 0) {
      state.currentTutorTopic--;
      renderTutorContent(state.currentTutorTopic);
    }
  });

  $("#tutor-next").addEventListener("click", () => {
    if (state.currentTutorTopic < TUTOR_TOPICS.length - 1) {
      state.currentTutorTopic++;
      renderTutorContent(state.currentTutorTopic);
    }
  });

  $("#tutor-topics").addEventListener("click", (e) => {
    const btn = e.target.closest(".topic-btn");
    if (btn) {
      state.currentTutorTopic = parseInt(btn.dataset.index);
      renderTutorContent(state.currentTutorTopic);
    }
  });
}

// ===== Actions =====
function selectPractical(id) {
  state.currentPractical = PRACTICALS.find((p) => p.id === id);
  if (!state.currentPractical) return;

  // Update sidebar selection
  $$("#practicals-list li").forEach((li) => {
    li.classList.toggle("active", parseInt(li.dataset.id) === id);
  });

  // Update badge
  const badge = $("#current-practical");
  badge.classList.add("active");
  badge.innerHTML = `<span class="practical-label">Practical ${id}: ${state.currentPractical.title}</span>`;

  // Load code
  $("#code-editor").value = state.currentPractical.code;
  updateLineNumbers();

  // Update theory
  renderTheory();

  // Update explanations
  if (state.explainMode) renderExplanations();

  // Switch to theory tab
  switchTab("theory");

  showToast(`Loaded Practical ${id}`, "success");
}

async function runCode() {
  const code = $("#code-editor").value.trim();
  if (!code) {
    showToast("Please enter some code first", "error");
    return;
  }

  showLoading(true);

  try {
    const apiUrl = CONFIG.USE_LOCAL ? CONFIG.LOCAL_API : CONFIG.API_URL;
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code }),
    });

    const result = await response.json();
    handleRunResult(result);
  } catch (error) {
    console.error("Error:", error);
    $("#console-output").textContent =
      `Connection Error: ${error.message}\n\nMake sure to start the server:\n  cd labmat\n  python server.py`;
    $("#console-output").className = "console error";
    switchTab("console");
    showToast("Failed to connect to server", "error");
  } finally {
    showLoading(false);
  }
}

function handleRunResult(result) {
  const plotsContainer = $("#plots-container");
  const consoleOutput = $("#console-output");

  if (result.success && result.plots && result.plots.length > 0) {
    plotsContainer.innerHTML = result.plots
      .map(
        (plot) => `
            <div class="plot-item">
                <img src="data:image/png;base64,${plot.image}" alt="Plot">
            </div>
        `,
      )
      .join("");
    switchTab("plots");
    showToast("Code executed successfully!", "success");
  } else if (!result.success) {
    plotsContainer.innerHTML = `
            <div class="empty-state">
                <div class="empty-icon">⚠️</div>
                <h3>Error</h3>
                <p>Check the console for details</p>
            </div>
        `;
    switchTab("console");
    showToast("Error executing code", "error");
  }

  if (result.success) {
    consoleOutput.textContent = result.console || "Code executed successfully!";
    consoleOutput.className = "console success";
  } else {
    consoleOutput.textContent = `Error:\n${result.error || "Unknown error"}\n\n${result.console || ""}`;
    consoleOutput.className = "console error";
  }
}

function clearEditor() {
  $("#code-editor").value = "";
  $("#plots-container").innerHTML = `
        <div class="empty-state">
            <div class="empty-icon">📊</div>
            <h3>No plots yet</h3>
            <p>Run your code to see plots here</p>
        </div>
    `;
  $("#console-output").textContent = "Ready to execute code...";
  $("#console-output").className = "console";
  updateLineNumbers();
  showToast("Editor cleared", "success");
}

function switchTab(tabName) {
  $$(".tab").forEach((tab) => {
    tab.classList.toggle("active", tab.dataset.tab === tabName);
  });
  $$(".tab-content").forEach((content) => {
    content.classList.toggle("active", content.id === `tab-${tabName}`);
  });
}

function toggleSidebar() {
  const isMobile = window.innerWidth <= 768;
  const sidebar = $("#sidebar");
  const overlay = $("#sidebar-overlay");
  const menuToggle = $("#menu-toggle");

  if (isMobile) {
    // Mobile: use .open class and transform
    state.sidebarOpen = !state.sidebarOpen;
    if (sidebar) sidebar.classList.toggle("open", state.sidebarOpen);
    if (overlay) overlay.classList.toggle("active", state.sidebarOpen);
    if (menuToggle) menuToggle.classList.toggle("active", state.sidebarOpen);
    document.body.style.overflow = state.sidebarOpen ? "hidden" : "";
  } else {
    // Desktop: use .collapsed class and margin
    if (sidebar) {
      sidebar.classList.toggle("collapsed");
      state.sidebarOpen = !sidebar.classList.contains("collapsed");
    }
  }
}

function closeSidebar() {
  const isMobile = window.innerWidth <= 768;
  const sidebar = $("#sidebar");
  const overlay = $("#sidebar-overlay");
  const menuToggle = $("#menu-toggle");

  if (isMobile) {
    state.sidebarOpen = false;
    if (sidebar) sidebar.classList.remove("open");
    if (overlay) overlay.classList.remove("active");
    if (menuToggle) menuToggle.classList.remove("active");
    document.body.style.overflow = "";
  } else {
    // Desktop: add collapsed class to hide
    if (sidebar) sidebar.classList.add("collapsed");
    state.sidebarOpen = false;
  }
}

function openTutor() {
  $("#tutor-modal").classList.add("active");
  renderTutorContent(state.currentTutorTopic);
  closeSidebar();
}

function closeTutor() {
  $("#tutor-modal").classList.remove("active");
}

function openShortcuts() {
  const modal = $("#shortcuts-modal");
  if (modal) {
    modal.classList.add("active");
  }
}

function closeShortcuts() {
  const modal = $("#shortcuts-modal");
  if (modal) {
    modal.classList.remove("active");
  }
}

function updateLineNumbers() {
  const editor = $("#code-editor");
  const lineNumbers = $("#line-numbers");

  if (!editor || !lineNumbers) return;

  const lines = editor.value.split("\n");
  const lineCount = lines.length;

  // Generate line numbers as a single string with newlines
  let lineNumberText = "";
  for (let i = 1; i <= lineCount; i++) {
    lineNumberText += i + "\n";
  }

  // Remove trailing newline
  lineNumbers.textContent = lineNumberText.trimEnd();

  // Sync scroll position
  lineNumbers.scrollTop = editor.scrollTop;
}

function showLoading(show) {
  $("#loading").classList.toggle("active", show);
}

function showToast(message, type = "info") {
  const container = $("#toast-container");
  const toast = document.createElement("div");
  toast.className = `toast ${type}`;
  toast.innerHTML = `
        <span class="toast-icon">${type === "success" ? "✓" : type === "error" ? "✗" : "ℹ"}</span>
        <span class="toast-message">${message}</span>
    `;
  container.appendChild(toast);

  setTimeout(() => {
    toast.classList.add("removing");
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

function escapeHtml(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}
