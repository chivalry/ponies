FROM python:3.12-slim
WORKDIR /app
COPY ../../backend/requirements.txt ./
RUN apt-get update \
	&& apt-get upgrade -y \
	&& pip install --no-cache-dir -r requirements.txt \
	&& apt-get clean \
	&& rm -rf /var/lib/apt/lists/*
COPY ../../backend .
CMD ["flask", "run", "--host=0.0.0.0"]
