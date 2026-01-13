"""
Motor DaaS Service - OBD2 Code Database Integration
Provides DTC code descriptions, repair costs, and diagnostic information
"""
import httpx
from typing import Dict, Optional
from app.config import settings


class MotorDaaSService:
    """
    Motor DaaS API Integration

    Provides:
    - DTC code descriptions
    - Common causes and symptoms
    - Estimated repair costs
    - Repair procedures
    """

    def __init__(self):
        self.base_url = "https://api.motor.com"
        self.public_key = settings.MOTOR_DAAS_PUBLIC_KEY
        self.private_key = settings.MOTOR_DAAS_PRIVATE_KEY
        self.timeout = 30.0

    async def get_dtc_info(self, dtc_code: str, vehicle_year: int = None, 
                          vehicle_make: str = None, vehicle_model: str = None) -> Dict:
        """
        Get detailed information about a DTC code

        Args:
            dtc_code: The diagnostic trouble code (e.g., "P0420")
            vehicle_year: Vehicle year for specific information
            vehicle_make: Vehicle manufacturer
            vehicle_model: Vehicle model

        Returns:
            Dict with DTC information including description, causes, symptoms, repair info
        """

        try:
            async with httpx.AsyncClient(timeout=self.timeout) as client:
                # Motor DaaS API endpoint
                url = f"{self.base_url}/v1/dtc/{dtc_code}"

                headers = {
                    "X-Public-Key": self.public_key,
                    "X-Private-Key": self.private_key,
                    "Content-Type": "application/json"
                }

                params = {}
                if vehicle_year:
                    params["year"] = vehicle_year
                if vehicle_make:
                    params["make"] = vehicle_make
                if vehicle_model:
                    params["model"] = vehicle_model

                response = await client.get(url, headers=headers, params=params)
                response.raise_for_status()

                data = response.json()

                return {
                    "code": dtc_code,
                    "description": data.get("description", ""),
                    "common_causes": data.get("causes", []),
                    "symptoms": data.get("symptoms", []),
                    "severity": data.get("severity", "moderate"),
                    "estimated_cost_min": data.get("repair_cost_min", 0),
                    "estimated_cost_max": data.get("repair_cost_max", 0),
                    "repair_procedures": data.get("procedures", []),
                    "related_codes": data.get("related_dtcs", [])
                }

        except httpx.HTTPError as e:
            # Fallback to basic info if API unavailable
            return self._get_basic_dtc_info(dtc_code)
        except Exception as e:
            print(f"Error fetching DTC info: {str(e)}")
            return self._get_basic_dtc_info(dtc_code)

    def _get_basic_dtc_info(self, dtc_code: str) -> Dict:
        """Fallback basic DTC information"""

        # Basic DTC database (subset for common codes)
        basic_dtc_db = {
            "P0420": {
                "description": "Catalyst System Efficiency Below Threshold (Bank 1)",
                "common_causes": ["Catalytic converter failure", "Oxygen sensor malfunction", "Exhaust leak"],
                "symptoms": ["Check engine light", "Reduced fuel economy", "Failed emissions test"],
                "severity": "moderate",
                "estimated_cost_min": 400,
                "estimated_cost_max": 2500
            },
            "P0171": {
                "description": "System Too Lean (Bank 1)",
                "common_causes": ["Vacuum leak", "MAF sensor issue", "Fuel pressure problem"],
                "symptoms": ["Rough idle", "Poor acceleration", "Check engine light"],
                "severity": "warning",
                "estimated_cost_min": 150,
                "estimated_cost_max": 800
            },
            "P0300": {
                "description": "Random/Multiple Cylinder Misfire Detected",
                "common_causes": ["Spark plugs", "Ignition coils", "Fuel injectors"],
                "symptoms": ["Engine shaking", "Loss of power", "Rough running"],
                "severity": "critical",
                "estimated_cost_min": 200,
                "estimated_cost_max": 1500
            }
        }

        info = basic_dtc_db.get(dtc_code, {
            "description": f"Diagnostic Trouble Code {dtc_code}",
            "common_causes": ["Requires professional diagnosis"],
            "symptoms": ["Check engine light illuminated"],
            "severity": "moderate",
            "estimated_cost_min": 100,
            "estimated_cost_max": 1000
        })

        info["code"] = dtc_code
        return info
