import requests
import json
import time
import uuid
import logging
from datetime import datetime

# Configure logging
log_file = f"performance3_automated.log"
logging.basicConfig(filename=log_file, level=logging.INFO,
                    format='%(asctime)s - %(levelname)s - %(message)s')

# Endpoint URL
url = "https://candy-be-51750986811.asia-southeast2.run.app/chats/ask"  # Replace with the actual endpoint URL

# Static data
name = "Callie"
session_id = str(uuid.uuid4())  # Generate a single session ID
logging.info(f"Using session ID: {session_id}")

# List of questions
questions = [
    "Kemarin saya melihat di website bahwa Astra Digital telah menjalin kerja sama dengan IKEA dalam hal transformasi digital. Saat ini, perusahaan kami yang bergerak di bidang pariwisata menghadapi tantangan dalam memonitoring serta meningkatkan efisiensi dan produktivitas kinerja tim yang tersebar di berbagai lokasi. Kami ingin mengetahui apakah Astra Digital memiliki solusi atau layanan yang dapat membantu kami dalam memantau aktivitas operasional tim secara real-time, mengidentifikasi area yang perlu ditingkatkan, serta memberikan insight yang dapat digunakan untuk pengambilan keputusan yang lebih cepat dan akurat. Apakah hal tersebut memungkinkan untuk didukung oleh Astra Digital?",
    "Perusahaan kami saat ini menghadapi tantangan dalam memantau dan menganalisis sentimen di media sosial secara menyeluruh, khususnya untuk mengukur efektivitas berbagai campaign digital yang telah kami jalankan di industri otomotif. Selain ingin memahami persepsi publik terhadap brand kami, kami juga ingin memiliki kemampuan untuk memantau aktivitas kampanye dari para kompetitor, termasuk mengidentifikasi topik-topik yang sering dibicarakan, keyword yang paling banyak digunakan, serta tren yang sedang berkembang di berbagai platform digital. Dengan kebutuhan tersebut, kami ingin mengetahui apakah Astra Digital memiliki solusi data-driven yang dapat membantu kami dalam memantau performa kampanye secara real-time dan memberikan insight strategis untuk pengambilan keputusan ke depannya?",
    "Saya memiliki tantangan dalam memantau performa operasional dari jaringan toko-toko saya yang tersebar di berbagai wilayah di Indonesia. Saat ini, keterbatasan dalam mendapatkan data yang menyeluruh dan real-time membuat proses pengambilan keputusan menjadi kurang optimal. Oleh karena itu, saya membutuhkan solusi yang dapat menyatukan berbagai data dari setiap toko, menyajikan insight yang komprehensif mengenai kinerja, tren penjualan, efektivitas promosi, dan operasional harian, sehingga saya dapat mengelola bisnis secara lebih efisien dan responsif. Apakah Astra Digital memiliki solusi digital yang dapat membantu saya dalam menjawab tantangan ini dan mendorong efisiensi manajemen toko secara nasional?",
    "Bagaimana Astra Digital menerapkan kombinasi antara Data Strategy Planning & Partnership, Data Governance & Enablement, Data Analytics, serta Data Management dalam membangun sistem ekosistem data yang tidak hanya terintegrasi, tetapi juga mampu meningkatkan efisiensi, akurasi pengambilan keputusan, serta memberikan nilai tambah jangka panjang bagi perusahaan klien dari berbagai sektor industri seperti otomotif, properti, dan agribisnis?",
    "Hari ini saya makan nasi dan ayam geprek di depan kantor. Kebetulan, makanannya sangat enak dengan cita rasa khas Nusantara. Masakannya pedas dan harganya sangat terjangkau. Dapatkah Anda menjelaskan lebih rinci mengenai apa yang membuat masakan tersebut terasa begitu istimewa—apakah karena penggunaan bumbu tradisional, tingkat kepedasan yang pas, tekstur ayam yang renyah, atau mungkin kombinasi dari semuanya? ",
    "Tadi di kampus ada ujian matematika terkait dengan statistik data. saya mempunyai soal misalkan di ruangkelas a terdapat 50 siswa dan yang diketahui nilai siswa tertinggi 80 dan terendah 40 kemudian satu siswa keluar dari kelas tersebut mengubah rata-rata kelas dari 79 menjadi 81 . berapakah nilai peserta yang keluar? dan berpakah rata-rata serta median data juga peserta tadi tidak keluar dari kelas?",
    "Dalam konteks pengembangan sistem berbasis machine learning, bagaimana proses end-to-end dari mulai pengumpulan data, pra-pemrosesan, pemilihan algoritma, pelatihan model, evaluasi performa, hingga implementasi model dilakukan dalam praktik nyata di industri, dan tantangan apa saja yang biasanya dihadapi dalam setiap tahap tersebut?",
    "Seiring berkembangnya teknologi dan semakin meluasnya penggunaan machine learning dalam berbagai sektor seperti kesehatan, keuangan, dan transportasi, bagaimana pentingnya interpretabilitas dan transparansi model dalam praktik machine learning, terutama ketika model yang digunakan adalah black-box seperti deep learning, dan bagaimana pendekatan explainable AI dapat membantu mengatasi tantangan tersebut?",
    "In an effort to strengthen our brand's digital presence in the automotive industry, we wanted to build a comprehensive sentiment and brand perception analysis system from various digital channels such as social media, online forums, and customer reviews. In addition to evaluating campaign performance, we also want to monitor perceptions of competitors. Does Astra Digital have a service or platform that can help us manage and analyse this data effectively and in real-time?",
    "Dalam upaya memperkuat kehadiran digital brand kami di industri otomotif, kami ingin membangun sistem analisis sentimen dan brand perception yang komprehensif dari berbagai kanal digital seperti media sosial, forum online, dan ulasan pelanggan. Selain untuk mengevaluasi performa campaign, kami juga ingin memantau persepsi terhadap kompetitor. Apakah Astra Digital memiliki layanan atau platform yang dapat membantu kami mengelola dan menganalisis data ini secara efektif dan real-time?"
]

# Function to send a request
def send_request(question, request_id):
    payload = {
        "name": name,
        "message": question,
        "session_id": session_id
    }
    headers = {'Content-Type': 'application/json'}

    start_time = time.time()
    try:
        response = requests.post(url, data=json.dumps(payload), headers=headers)
        response.raise_for_status()
        end_time = time.time()
        response_time = end_time - start_time
        response_json = response.json()

        log_message = f"Request {request_id}:\n" \
                      f"  Question: {question}\n" \
                      f"  Response: {response_json}\n" \
                      f"  Response Time: {response_time:.4f} seconds"
        logging.info(log_message)

        return response_time

    except requests.exceptions.RequestException as e:
        error_message = f"Request {request_id} failed: {e}"
        logging.error(error_message)
        return None


# Main function to send sequential requests
def main():
    response_times = []

    for i, question in enumerate(questions):
        response_time = send_request(question, i + 1)
        if response_time is not None:
            response_times.append(response_time)
        time.sleep(0.1)  # Optional: Add a small delay between requests

    # Calculate average response time
    if response_times:
        average_response_time = sum(response_times) / len(response_times)
        summary_message = "\n--- Summary ---\n" \
                          f"Total Requests: {len(questions)}\n" \
                          f"Successful Requests: {len(response_times)}\n" \
                          f"Average Response Time: {average_response_time:.4f} seconds"
        logging.info(summary_message)
        print(f"Results written to log file: {log_file}")
    else:
        summary_message = "\n--- Summary ---\nNo successful requests."
        logging.warning(summary_message)
        print(f"No successful requests. See log file: {log_file}")


if __name__ == "__main__":
    main()
