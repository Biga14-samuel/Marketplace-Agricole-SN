"""
Property-Based Test for Bug 1: Cart Item Creation with camelCase Fields

This test explores the fault condition where the frontend sends productId/variantId
(camelCase) instead of product_id/variant_id (snake_case) to the backend.

CRITICAL: This test MUST FAIL on unfixed code - failure confirms the bug exists.
DO NOT attempt to fix the test or the code when it fails.

The test encodes the expected behavior - it will validate the fix when it passes
after implementation.

GOAL: Surface counterexamples that demonstrate the bug exists.

**Validates: Requirements 1.1, 1.2**
"""

import pytest
from fastapi import status
from hypothesis import given, strategies as st, settings, Phase
from hypothesis import example


# ============================================
# FAULT CONDITION DEFINITION
# ============================================

def is_bug_condition(request_body: dict) -> bool:
    """
    Determines if the request body triggers the bug condition.
    
    Bug condition: Request has productId/variantId (camelCase) instead of
    product_id/variant_id (snake_case).
    
    Args:
        request_body: The request payload
        
    Returns:
        True if this is a bug 