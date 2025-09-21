// Conditions API Test Utilities
// This file contains test functions to verify the Conditions API integration

import { conditionsService } from "~/services/conditionsService"
import type { ConditionFormData, ConditionFilters } from "~/types/condition"

/**
 * Test all condition API endpoints
 * Run this in the browser console to test API functionality
 */
export const testConditionsAPI = async () => {
  console.log("🧪 Testing Conditions API...")
  
  try {
    // Test 1: Get all conditions
    console.log("1️⃣ Testing getAll...")
    const allConditions = await conditionsService.getAll({ limit: 5 })
    console.log("✅ Get all conditions:", allConditions)
    
    // Test 2: Get active conditions
    console.log("2️⃣ Testing getActive...")
    const activeConditions = await conditionsService.getActive()
    console.log("✅ Get active conditions:", activeConditions)
    
    // Test 3: Get dropdown data
    console.log("3️⃣ Testing getDropdown...")
    const dropdownData = await conditionsService.getDropdown()
    console.log("✅ Get dropdown data:", dropdownData)
    
    // Test 4: Get statistics
    console.log("4️⃣ Testing getStats...")
    const stats = await conditionsService.getStats()
    console.log("✅ Get statistics:", stats)
    
    // Test 5: Search conditions
    console.log("5️⃣ Testing search...")
    const searchResults = await conditionsService.search("new")
    console.log("✅ Search results:", searchResults)
    
    // Test 6: Get condition by ID (if any exist)
    if (allConditions.conditions.length > 0) {
      console.log("6️⃣ Testing getById...")
      const condition = await conditionsService.getById(allConditions.conditions[0]._id)
      console.log("✅ Get by ID:", condition)
      
      // Test 7: Get condition by slug
      console.log("7️⃣ Testing getBySlug...")
      const conditionBySlug = await conditionsService.getBySlug(allConditions.conditions[0].slug)
      console.log("✅ Get by slug:", conditionBySlug)
    }
    
    console.log("🎉 All API tests completed successfully!")
    
  } catch (error) {
    console.error("❌ API test failed:", error)
  }
}

/**
 * Test condition validation
 */
export const testConditionValidation = () => {
  console.log("🧪 Testing Condition Validation...")
  
  const testCases = [
    { name: "", expected: "invalid" },
    { name: "A", expected: "invalid" }, // Too short
    { name: "AB", expected: "valid" }, // Minimum length
    { name: "New", expected: "valid" },
    { name: "Used", expected: "valid" },
    { name: "Certified Pre-Owned", expected: "valid" },
    { name: "Like-New", expected: "valid" },
    { name: "A".repeat(51), expected: "invalid" }, // Too long
    { name: "Test@Condition", expected: "invalid" }, // Invalid characters
    { name: "Test123", expected: "valid" },
    { name: "Test 123", expected: "valid" },
    { name: "Test-123", expected: "valid" },
  ]
  
  testCases.forEach(({ name, expected }) => {
    const isValid = /^[a-zA-Z0-9\s\-]{2,50}$/.test(name.trim()) && name.trim().length >= 2
    const result = isValid ? "valid" : "invalid"
    const status = result === expected ? "✅" : "❌"
    console.log(`${status} "${name}" -> ${result} (expected: ${expected})`)
  })
  
  console.log("🎉 Validation tests completed!")
}

/**
 * Test CRUD operations (use with caution - will create/modify data)
 */
export const testConditionCRUD = async () => {
  console.log("🧪 Testing CRUD Operations...")
  console.warn("⚠️ This will create and modify data!")
  
  try {
    // Create a test condition
    const testCondition: ConditionFormData = {
      name: "Test Condition",
      active: true
    }
    
    console.log("1️⃣ Creating test condition...")
    const created = await conditionsService.create(testCondition)
    console.log("✅ Created:", created)
    
    // Update the condition
    console.log("2️⃣ Updating test condition...")
    const updated = await conditionsService.update(created._id, { name: "Updated Test Condition" })
    console.log("✅ Updated:", updated)
    
    // Update status
    console.log("3️⃣ Updating status...")
    const statusUpdated = await conditionsService.updateStatus(created._id, false)
    console.log("✅ Status updated:", statusUpdated)
    
    // Delete the condition
    console.log("4️⃣ Deleting test condition...")
    await conditionsService.delete(created._id)
    console.log("✅ Deleted successfully")
    
    console.log("🎉 CRUD tests completed successfully!")
    
  } catch (error) {
    console.error("❌ CRUD test failed:", error)
  }
}

// Browser console helpers
if (typeof window !== 'undefined') {
  // @ts-ignore
  window.testConditionsAPI = testConditionsAPI
  // @ts-ignore
  window.testConditionValidation = testConditionValidation
  // @ts-ignore
  window.testConditionCRUD = testConditionCRUD
  
  console.log(`
🧪 Conditions API Test Utilities Loaded!

Available functions:
- testConditionsAPI() - Test all read operations
- testConditionValidation() - Test validation rules
- testConditionCRUD() - Test create/update/delete (use with caution!)

Example usage:
await testConditionsAPI()
  `)
}
