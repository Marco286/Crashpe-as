#!/usr/bin/env python3

import requests
import sys
import json
from datetime import datetime

class CrashPecasAPITester:
    def __init__(self, base_url="https://carpartshub-2.preview.emergentagent.com"):
        self.base_url = base_url
        self.api_url = f"{base_url}/api"
        self.tests_run = 0
        self.tests_passed = 0
        self.failed_tests = []

    def run_test(self, name, method, endpoint, expected_status, data=None, params=None):
        """Run a single API test"""
        url = f"{self.api_url}/{endpoint}"
        headers = {'Content-Type': 'application/json'}

        self.tests_run += 1
        print(f"\n🔍 Testing {name}...")
        print(f"   URL: {url}")
        
        try:
            if method == 'GET':
                response = requests.get(url, headers=headers, params=params, timeout=10)
            elif method == 'POST':
                response = requests.post(url, json=data, headers=headers, timeout=10)

            success = response.status_code == expected_status
            if success:
                self.tests_passed += 1
                print(f"✅ Passed - Status: {response.status_code}")
                try:
                    response_data = response.json()
                    if isinstance(response_data, list):
                        print(f"   Response: List with {len(response_data)} items")
                    elif isinstance(response_data, dict):
                        print(f"   Response keys: {list(response_data.keys())}")
                except:
                    print(f"   Response: {response.text[:100]}...")
            else:
                print(f"❌ Failed - Expected {expected_status}, got {response.status_code}")
                print(f"   Response: {response.text[:200]}...")
                self.failed_tests.append({
                    'name': name,
                    'expected': expected_status,
                    'actual': response.status_code,
                    'response': response.text[:200]
                })

            return success, response.json() if success and response.text else {}

        except requests.exceptions.Timeout:
            print(f"❌ Failed - Request timeout")
            self.failed_tests.append({'name': name, 'error': 'Timeout'})
            return False, {}
        except requests.exceptions.ConnectionError:
            print(f"❌ Failed - Connection error")
            self.failed_tests.append({'name': name, 'error': 'Connection error'})
            return False, {}
        except Exception as e:
            print(f"❌ Failed - Error: {str(e)}")
            self.failed_tests.append({'name': name, 'error': str(e)})
            return False, {}

    def test_root_endpoint(self):
        """Test root API endpoint"""
        return self.run_test("Root API", "GET", "", 200)

    def test_get_categories(self):
        """Test getting categories"""
        success, response = self.run_test("Get Categories", "GET", "categories", 200)
        if success and isinstance(response, list) and len(response) > 0:
            print(f"   Found {len(response)} categories")
            return True, response
        return False, {}

    def test_get_category_by_slug(self, slug="motores"):
        """Test getting specific category"""
        return self.run_test(f"Get Category '{slug}'", "GET", f"categories/{slug}", 200)

    def test_get_parts(self):
        """Test getting all parts"""
        success, response = self.run_test("Get All Parts", "GET", "parts", 200)
        if success and isinstance(response, list):
            print(f"   Found {len(response)} parts")
            return True, response
        return False, {}

    def test_get_parts_with_filters(self):
        """Test getting parts with filters"""
        # Test category filter
        success1, _ = self.run_test("Get Parts by Category", "GET", "parts", 200, 
                                   params={"category": "motores"})
        
        # Test condition filter
        success2, _ = self.run_test("Get Parts by Condition", "GET", "parts", 200, 
                                   params={"condition": "Usada"})
        
        # Test combined filters
        success3, _ = self.run_test("Get Parts with Combined Filters", "GET", "parts", 200, 
                                   params={"category": "motores", "condition": "Usada"})
        
        return success1 and success2 and success3

    def test_get_part_by_id(self, part_id="p1"):
        """Test getting specific part"""
        return self.run_test(f"Get Part '{part_id}'", "GET", f"parts/{part_id}", 200)

    def test_create_part_request(self):
        """Test creating a part request"""
        test_data = {
            "full_name": "João Silva",
            "email": "joao.silva@test.com",
            "phone": "+351912345678",
            "car_brand": "BMW",
            "car_model": "Série 3",
            "car_year": "2018",
            "engine_type": "2.0d",
            "part_type": "Motor",
            "part_condition": "Usada",
            "additional_description": "Procuro motor em bom estado para BMW E90"
        }
        
        success, response = self.run_test("Create Part Request", "POST", "part-requests", 200, test_data)
        if success and response.get('success'):
            print(f"   Request ID: {response.get('request_id')}")
            print(f"   WhatsApp URL generated: {'Yes' if response.get('whatsapp_url') else 'No'}")
            return True, response
        return False, {}

    def test_get_part_requests(self):
        """Test getting part requests"""
        return self.run_test("Get Part Requests", "GET", "part-requests", 200)

    def test_create_contact(self):
        """Test creating a contact message"""
        test_data = {
            "name": "Maria Santos",
            "email": "maria.santos@test.com",
            "phone": "+351987654321",
            "subject": "Informações sobre peças",
            "message": "Gostaria de saber mais sobre as vossas peças disponíveis."
        }
        
        success, response = self.run_test("Create Contact", "POST", "contacts", 200, test_data)
        if success and response.get('success'):
            print(f"   Contact ID: {response.get('contact_id')}")
            print(f"   WhatsApp URL generated: {'Yes' if response.get('whatsapp_url') else 'No'}")
            return True, response
        return False, {}

    def test_request_part_info(self, part_id="p1"):
        """Test requesting part info (WhatsApp integration)"""
        test_data = {
            "name": "Carlos Pereira",
            "phone": "+351911222333"
        }
        
        success, response = self.run_test(f"Request Part Info for '{part_id}'", "POST", 
                                        f"parts/{part_id}/request-info", 200, test_data)
        if success and response.get('success'):
            print(f"   WhatsApp URL generated: {'Yes' if response.get('whatsapp_url') else 'No'}")
            return True, response
        return False, {}

    def test_invalid_endpoints(self):
        """Test invalid endpoints return proper errors"""
        success1, _ = self.run_test("Invalid Category", "GET", "categories/invalid-slug", 404)
        success2, _ = self.run_test("Invalid Part", "GET", "parts/invalid-id", 404)
        success3, _ = self.run_test("Invalid Part Info Request", "POST", "parts/invalid-id/request-info", 404)
        
        return success1 and success2 and success3

def main():
    print("🚗 CrashPeças API Testing Suite")
    print("=" * 50)
    
    tester = CrashPecasAPITester()
    
    # Test basic endpoints
    print("\n📋 Testing Basic Endpoints...")
    tester.test_root_endpoint()
    
    # Test categories
    print("\n📂 Testing Categories...")
    categories_success, categories = tester.test_get_categories()
    if categories_success and categories:
        tester.test_get_category_by_slug("motores")
        tester.test_get_category_by_slug("portas")
    
    # Test parts
    print("\n🔧 Testing Parts...")
    parts_success, parts = tester.test_get_parts()
    tester.test_get_parts_with_filters()
    
    if parts_success and parts:
        # Test getting specific part
        first_part_id = parts[0].get('id') if parts else 'p1'
        tester.test_get_part_by_id(first_part_id)
        
        # Test part info request
        tester.test_request_part_info(first_part_id)
    
    # Test part requests
    print("\n📝 Testing Part Requests...")
    tester.test_create_part_request()
    tester.test_get_part_requests()
    
    # Test contacts
    print("\n📞 Testing Contacts...")
    tester.test_create_contact()
    
    # Test error handling
    print("\n❌ Testing Error Handling...")
    tester.test_invalid_endpoints()
    
    # Print results
    print("\n" + "=" * 50)
    print(f"📊 Test Results: {tester.tests_passed}/{tester.tests_run} passed")
    
    if tester.failed_tests:
        print(f"\n❌ Failed Tests ({len(tester.failed_tests)}):")
        for test in tester.failed_tests:
            error_msg = test.get('error', f"Expected {test.get('expected')}, got {test.get('actual')}")
            print(f"   • {test['name']}: {error_msg}")
    
    success_rate = (tester.tests_passed / tester.tests_run * 100) if tester.tests_run > 0 else 0
    print(f"\n✅ Success Rate: {success_rate:.1f}%")
    
    return 0 if tester.tests_passed == tester.tests_run else 1

if __name__ == "__main__":
    sys.exit(main())