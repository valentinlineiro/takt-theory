#!/usr/bin/env python3
"""
TAKT v3.0 Reference Implementation: Edge-AI Classifier under Covariate Drift.
This script demonstrates the Dynamic Safety Contract in action, showing how
the margin monitor blocks a silent failure that goes undetected by the empirical test set.
"""

import math

# 1. System elements
S = [-20, -15, -10, -5, 0, 5, 10, 15]  # State space
T = [-15, -5, 5, 15]                   # Test set

def D(s):
    """Optimal decision operator (Ground Truth)."""
    return 1 if s >= 0 else 0

def R(s, theta):
    """Representational quantizer with drift theta."""
    return math.floor((s - theta) / 10)

def dist(x, y):
    """Distance function."""
    return abs(x - y)

# 2. TAKT Indicators
def is_safe_on_test(R_t, T_set):
    """Check if the representation is safe on the test set."""
    for x in T_set:
        for y in T_set:
            if R_t(x) == R_t(y) and D(x) != D(y):
                return False
    return True

def has_fiber_coverage(R_t, S_set, T_set):
    """Check if test set T has fiber coverage over domain S."""
    for x in S_set:
        covered = False
        for x_prime in T_set:
            if R_t(x) == R_t(x_prime) and D(x) == D(x_prime):
                covered = True
                break
        if not covered:
            return False
    return True

def calculate_margin(R_t, S_set):
    """Calculate the decision margin M(R). Returns 0 if unsafe."""
    # First, verify global safety
    for x in S_set:
        for y in S_set:
            if R_t(x) == R_t(y) and D(x) != D(y):
                return 0
    
    # Calculate minimum distance between separate representations with different decisions
    min_dist = float('inf')
    for x in S_set:
        for y in S_set:
            if R_t(x) != R_t(y) and D(x) != D(y):
                min_dist = min(min_dist, dist(x, y))
    
    return min_dist if min_dist != float('inf') else 0

def is_policy_aligned(pi, R_t, T_set):
    """Check if execution policy is aligned with optimal decisions on T."""
    for x in T_set:
        if pi(R_t(x)) != D(x):
            return False
    return True

# 3. Dynamic Safety Contract Audit
def audit_contract(R_t, pi, T_set, S_set, m_min):
    """Audits the contract. Returns (active, reason)."""
    if not is_safe_on_test(R_t, T_set):
        return False, "EMPIRICAL_SAFETY_VIOLATED"
    if not has_fiber_coverage(R_t, S_set, T_set):
        return False, "FIBER_COVERAGE_VIOLATED"
    
    margin = calculate_margin(R_t, S_set)
    if margin < m_min:
        return False, f"MARGIN_VIOLATED (Margin = {margin} < {m_min})"
    
    if not is_policy_aligned(pi, R_t, T_set):
        return False, "POLICY_MISALIGNED"
        
    return True, f"ACTIVE (Margin = {margin})"

# 4. Agent policy definition
def pi(code):
    """Agent's nominal policy."""
    if code <= -1:
        return 0  # NEG
    else:
        return 1  # POS

# 5. Simulation
if __name__ == "__main__":
    m_min = 5
    print("=== TAKT Dynamic Safety Contract Audit Simulation ===")
    print(f"State space S = {S}")
    print(f"Test set T = {T}")
    print(f"Contract minimum margin m_min = {m_min}\n")

    # Time 0: Nominal state (no drift)
    print("--- Time t = 0: Nominal State (Drift theta = 0) ---")
    R_0 = lambda s: R(s, 0)
    active, status = audit_contract(R_0, pi, T, S, m_min)
    print(f"Empirical Safety on Test Set: {is_safe_on_test(R_0, T)}")
    print(f"Fiber Coverage on Test Set: {has_fiber_coverage(R_0, S, T)}")
    print(f"Contract Status: {status}")
    print(f"Policy execution: {'ENABLED' if active else 'DISABLED (Safety Shutdown)'}\n")

    # Time 1: Drifted state (drift theta = 3)
    print("--- Time t = 1: Drifted State (Drift theta = 3) ---")
    R_1 = lambda s: R(s, 3)
    active, status = audit_contract(R_1, pi, T, S, m_min)
    print(f"Empirical Safety on Test Set: {is_safe_on_test(R_1, T)}  <-- SILENT FAILURE!")
    print(f"Fiber Coverage on Test Set: {has_fiber_coverage(R_1, S, T)}")
    print(f"Contract Status: {status}")
    print(f"Policy execution: {'ENABLED' if active else 'DISABLED (Safety Shutdown)'}")
    print("====================================================")
