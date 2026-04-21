FROM python:3.12-slim

WORKDIR /app

COPY src_back/requirements.txt ./requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 5000

CMD ["gunicorn", "--bind", "0.0.0.0:5000", "--reload", "src_back.app:app"]
