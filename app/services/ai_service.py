"""
AI Service - OpenRouter/Claude Integration for Diagnostics
Generates natural language diagnosis and repair recommendations
"""
import httpx
from typing import List, Dict
from app.config import settings


class AIService:
    """
    AI-powered diagnostic analysis using OpenRouter (Claude 3.5)

    Capabilities:
    - Natural language diagnosis generation
    - Repair priority recommendations
    - Cost-benefit analysis
    - Plain English explanations
    """

    def __init__(self):
        self.api_key = settings.OPENROUTER_API_KEY
        self.base_url = "https://openrouter.ai/api/v1"
        self.model = settings.AI_MODEL  # anthropic/claude-3.5-sonnet
        self.timeout = 60.0

    async def generate_diagnosis(
        self,
        dtc_codes: List[Dict],
        vehicle_info: Dict,
        mileage: int = None
    ) -> Dict:
        """
        Generate AI-powered diagnosis from DTC codes

        Args:
            dtc_codes: List of DTC code objects with descriptions
            vehicle_info: Vehicle details (year, make, model)
            mileage: Current vehicle mileage

        Returns:
            Dict with AI-generated diagnosis, recommendations, and priorities
        """

        # Build prompt for Claude
        prompt = self._build_diagnosis_prompt(dtc_codes, vehicle_info, mileage)

        try:
            async with httpx.AsyncClient(timeout=self.timeout) as client:
                headers = {
                    "Authorization": f"Bearer {self.api_key}",
                    "Content-Type": "application/json"
                }

                payload = {
                    "model": self.model,
                    "messages": [
                        {
                            "role": "system",
                            "content": "You are an expert automotive diagnostic technician with 20+ years of experience. Provide clear, accurate, and helpful diagnostic analysis."
                        },
                        {
                            "role": "user",
                            "content": prompt
                        }
                    ],
                    "temperature": 0.3,  # Lower temperature for more factual responses
                    "max_tokens": 2000
                }

                response = await client.post(
                    f"{self.base_url}/chat/completions",
                    headers=headers,
                    json=payload
                )
                response.raise_for_status()

                data = response.json()
                ai_response = data["choices"][0]["message"]["content"]

                # Parse AI response into structured format
                return self._parse_ai_response(ai_response, dtc_codes)

        except Exception as e:
            print(f"AI Service Error: {str(e)}")
            return self._generate_fallback_diagnosis(dtc_codes, vehicle_info)

    def _build_diagnosis_prompt(self, dtc_codes: List[Dict], vehicle_info: Dict, mileage: int) -> str:
        """Build detailed prompt for AI diagnosis"""

        vehicle_str = f"{vehicle_info.get('year')} {vehicle_info.get('make')} {vehicle_info.get('model')}"
        mileage_str = f" with {mileage:,} miles" if mileage else ""

        codes_str = "\n".join([
            f"- {code['code']}: {code.get('description', 'No description')}"
            for code in dtc_codes
        ])

        prompt = f"""Analyze the following diagnostic trouble codes for a {vehicle_str}{mileage_str}:

{codes_str}

Please provide:
1. **Overall Diagnosis**: A clear summary of what's wrong with the vehicle
2. **Severity Assessment**: Rate the urgency (immediate, soon, routine, or monitor)
3. **Recommended Actions**: Step-by-step what the owner should do
4. **Estimated Costs**: Realistic repair cost ranges
5. **Safety Concerns**: Any safety issues to be aware of
6. **DIY vs Professional**: What can be done at home vs needs a mechanic

Format your response in clear sections with plain language a car owner can understand."""

        return prompt

    def _parse_ai_response(self, ai_text: str, dtc_codes: List[Dict]) -> Dict:
        """Parse AI response into structured format"""

        return {
            "summary": ai_text[:500],  # First 500 chars as summary
            "full_diagnosis": ai_text,
            "urgency_level": self._extract_urgency(ai_text),
            "recommended_actions": self._extract_actions(ai_text),
            "safety_concerns": self._extract_safety_concerns(ai_text),
            "estimated_cost_range": self._extract_costs(dtc_codes),
            "ai_confidence": "high",  # Could be calculated based on code severity
            "generated_at": "now"
        }

    def _extract_urgency(self, text: str) -> str:
        """Extract urgency level from AI response"""
        text_lower = text.lower()

        if any(word in text_lower for word in ["immediate", "urgent", "critical", "dangerous"]):
            return "immediate"
        elif any(word in text_lower for word in ["soon", "prompt", "quickly"]):
            return "soon"
        elif any(word in text_lower for word in ["monitor", "watch", "keep eye"]):
            return "monitor"
        else:
            return "routine"

    def _extract_actions(self, text: str) -> List[str]:
        """Extract recommended actions from AI response"""
        # Simple extraction - in production could use more sophisticated NLP
        actions = []

        # Look for numbered or bulleted lists
        lines = text.split("\n")
        for line in lines:
            line = line.strip()
            if line and (line[0].isdigit() or line.startswith("-") or line.startswith("*")):
                # Clean up formatting
                action = line.lstrip("0123456789.-* ")
                if len(action) > 10:  # Reasonable action length
                    actions.append(action)

        return actions[:10]  # Max 10 actions

    def _extract_safety_concerns(self, text: str) -> List[str]:
        """Extract safety concerns from AI response"""
        concerns = []
        text_lower = text.lower()

        safety_keywords = ["safety", "dangerous", "risk", "hazard", "warning"]

        lines = text.split("\n")
        for line in lines:
            if any(keyword in line.lower() for keyword in safety_keywords):
                concerns.append(line.strip())

        return concerns[:5]  # Max 5 concerns

    def _extract_costs(self, dtc_codes: List[Dict]) -> Dict:
        """Calculate total estimated cost range"""
        total_min = sum(code.get("estimated_cost_min", 0) for code in dtc_codes)
        total_max = sum(code.get("estimated_cost_max", 0) for code in dtc_codes)

        return {
            "min": total_min,
            "max": total_max,
            "currency": "USD"
        }

    def _generate_fallback_diagnosis(self, dtc_codes: List[Dict], vehicle_info: Dict) -> Dict:
        """Generate basic diagnosis if AI service is unavailable"""

        codes_list = ", ".join([code["code"] for code in dtc_codes])

        return {
            "summary": f"Your vehicle has diagnostic codes: {codes_list}. Professional inspection recommended.",
            "full_diagnosis": "AI diagnostic service temporarily unavailable. Please consult with a qualified mechanic for detailed analysis.",
            "urgency_level": "soon",
            "recommended_actions": [
                "Have vehicle inspected by qualified mechanic",
                "Do not ignore warning lights",
                "Monitor vehicle performance"
            ],
            "safety_concerns": ["Check engine light requires attention"],
            "estimated_cost_range": self._extract_costs(dtc_codes),
            "ai_confidence": "low",
            "generated_at": "now"
        }

    async def calculate_health_score(
        self,
        dtc_count: int,
        severity_levels: List[str],
        vehicle_age: int,
        mileage: int
    ) -> int:
        """
        Calculate overall vehicle health score (0-100)

        Higher score = better health
        """

        base_score = 100

        # Deduct for DTC codes
        base_score -= (dtc_count * 10)

        # Deduct for severity
        severity_penalties = {
            "critical": 25,
            "warning": 15,
            "moderate": 10,
            "info": 5
        }

        for severity in severity_levels:
            base_score -= severity_penalties.get(severity, 10)

        # Slight adjustment for age/mileage
        if mileage > 150000:
            base_score -= 5
        if vehicle_age > 10:
            base_score -= 5

        # Ensure score is between 0-100
        return max(0, min(100, base_score))
