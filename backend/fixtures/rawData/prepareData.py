import datetime
from decimal import Decimal
import json
from typing import List


def load_raw_data(path: str) -> List:
    with open(path) as fp:
        doctors_raw_data = json.load(fp)
    return doctors_raw_data


def prepare_fixtures(doctors_raw_data: List) -> tuple[List[dict], List[dict]]:
    doctors_fixture, doctors_locations_fixtures = [], []
    for doctor_data in doctors_raw_data:
        doctor_id = int(doctor_data["Doc ID"])
        location_id = int(doctor_data["Loc ID"].replace("e", ""))

        # Doctor
        if doctor_id not in doctors_fixture:
            doctors_fixture.append(
                {
                    "model": "doctors.doctor",
                    "pk": doctor_id,
                    "fields": {
                        "full_name": doctor_data["Name"],
                        "gender": (
                            doctor_data["Gender"][0] if doctor_data["Gender"] else "M"
                        ),
                        "category": int(doctor_data["Category"])
                        if doctor_data["Category"]
                        else None,
                        "specialities": (
                            [
                                int(key)
                                for key in doctor_data["Specialities"][:-1].split(", ")
                            ]
                            if doctor_data["Specialities"]
                            else []
                        ),
                        "i_care_better": (
                            doctor_data["Icarebetter?"]
                            if doctor_data["Icarebetter?"]
                            else ""
                        ),
                        "nancys_nook": True if doctor_data["Nancy's Nook?"] else False,
                        "status": "APPROVED" if doctor_data["Status"].lower() == "approved" else "DELETED",
                        "internal_notes": "" if doctor_data["Status"].lower() == "approved" else doctor_data["Status"],
                        "added_at": datetime.datetime.now().strftime(
                            "%Y-%m-%d %H:%M:%S"
                        ),
                        "image": f"images/{doctor_id}.jpg"
                    },
                }
            )

        # Locations
        doctors_locations_fixtures.append(
            {
                "model": "doctors.doctorLocation",
                "pk": location_id,
                "fields": {
                    "doctor": doctor_id,
                    "hospital_name": doctor_data["Hospital"],
                    "address": doctor_data["Address"],
                    "lat": float(doctor_data["Lat"]),
                    "lng": float(doctor_data["Long"]),
                    "phone": doctor_data["Phone"],
                    "email": doctor_data["Email"],
                    "website": doctor_data["Website"],
                    "private_only": True if doctor_data["Private only?"] else False,
                },
            }
        )

    return doctors_fixture, doctors_locations_fixtures


def save_to_file(data: dict, path: str) -> None:
    pass


if __name__ == "__main__":
    doctors_raw_data = load_raw_data("doctorsRawData.json")
    doctors_fixture, doctors_locations_fixtures = prepare_fixtures(doctors_raw_data)
    with open("doctors.json", "w+") as fp:
        json.dump(doctors_fixture, fp, indent=4)
    with open("doctorLocations.json", "w+") as fp:
        json.dump(doctors_locations_fixtures, fp, indent=4)
