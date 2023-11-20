import datetime
import json
from typing import List


def load_raw_data(path: str) -> dict:
    with open(path) as fp:
        doctors_raw_data = json.load(fp)
    return doctors_raw_data


def prepare_fixtures(doctors_raw_data: dict) -> tuple[List[dict], List[dict]]:
    doctor_name_to_id = dict()
    doctors_fixture, doctors_locations_fixtures = [], []
    for doctor_id, doctor_data in doctors_raw_data.items():
        name = doctor_data["Name"]
        location_id = doctor_id

        # Doctor
        if name in doctor_name_to_id:
            doctor_id = doctor_name_to_id[name]
        else:
            doctor_name_to_id[name] = doctor_id
            doctors_fixture.append(
                {
                    "model": "doctors.doctor",
                    "pk": doctor_id,
                    "fields": {
                        "full_name": name,
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
                        "status": "APPROVED",
                        "added_at": datetime.datetime.now().strftime(
                            "%Y-%m-%d %H:%M:%S"
                        ),
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
                    "lat": doctor_data["Lat"],
                    "lng": doctor_data["Long"],
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
