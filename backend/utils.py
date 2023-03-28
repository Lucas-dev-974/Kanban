def toJson(data, model, one = False):
    model_fields = [column.name for column in model.__table__.columns]
    json = []

    if not one:
        for dta in data:
            model = {}
            for fields in model_fields:
                model[fields] = getattr(dta, fields)
            json.append(model)
    else:
        json = {}
        for fields in model_fields:
            json[fields] = getattr(data, fields)
            
    return json

