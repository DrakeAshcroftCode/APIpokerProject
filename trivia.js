

public class TriviaGame {
    public static void main(String[] args) {
        try {
            // Create a HttpClient
            HttpClient client = HttpClient.newHttpClient();

            // Define the API URL with parameters
            String apiUrl = "https://opentdb.com/api.php?amount=10&category=14&difficulty=easy&type=multiple";

            // Create an HTTP request
            HttpRequest request = HttpRequest.newBuilder()
                    .uri(new URI(apiUrl))
                    .GET()
                    .build();

            // Send the request and receive the response
            HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());

            // Check if the response status code is OK (200)
            if (response.statusCode() == 200) {
                // Parse the JSON response
                JSONObject jsonResponse = new JSONObject(response.body());
                JSONArray results = jsonResponse.getJSONArray("results");

                // Process the trivia questions
                for (int i = 0; i < results.length(); i++) {
                    JSONObject questionObject = results.getJSONObject(i);
                    String question = questionObject.getString("question");
                    JSONArray incorrectAnswers = questionObject.getJSONArray("incorrect_answers");
                    String correctAnswer = questionObject.getString("correct_answer");

                    // Output the question and answers (you can customize this part)
                    System.out.println("Question " + (i + 1) + ": " + question);
                    System.out.println("Correct Answer: " + correctAnswer);
                    System.out.println("Incorrect Answers: " + incorrectAnswers);
                    System.out.println();
                }
            } else {
                System.out.println("Failed to fetch trivia questions. Response code: " + response.statusCode());
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}

