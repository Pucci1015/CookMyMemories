package com.example.demo.service;

import com.example.demo.dto.RecipeListDTO;
import com.example.demo.dto.RecipeListResponseDTO;
import com.example.demo.dto.RecipeMatchInfoDTO;
import com.example.demo.dto.RecipeSearchResultDTO;
import com.example.demo.dto.SearchByIngredientsRequest;
import com.example.demo.dto.MissingIngredientDTO;
// import com.example.demo.dto.IngredientDetailDTO;
import com.example.demo.dto.RecipeDetailDTO;
import com.example.demo.dto.RecipeFilterResponseDTO;
import com.example.demo.dto.RecipeIngredientDetailDTO;
// import com.example.demo.dto.RecipeListDTO;
// import com.example.demo.dto.RecipeListResponseDTO;
import com.example.demo.entity.Recipe;
import com.example.demo.repository.IngredientSubstituteRepository;
// import com.example.demo.entity.RecipeIngredient;
import com.example.demo.repository.RecipeIngredientRepository;
import com.example.demo.repository.RecipeRepository;

import jakarta.transaction.Transactional;

import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;


@Service
public class RecipeService {

    private final RecipeRepository recipeRepository;
    private final RecipeIngredientRepository recipeIngredientRepository;
    private final IngredientSubstituteRepository ingredientSubstituteRepository;

    public RecipeService(RecipeRepository recipeRepository, RecipeIngredientRepository recipeIngredientRepository, IngredientSubstituteRepository ingredientSubstituteRepository) {
        this.recipeRepository = recipeRepository;
        this.recipeIngredientRepository = recipeIngredientRepository;
        this.ingredientSubstituteRepository = ingredientSubstituteRepository;
    }
    public RecipeListResponseDTO getAllRecipes() {
        List<RecipeListDTO> recipes = recipeRepository.findAllRecipesWithIngredientCount();
        return new RecipeListResponseDTO(recipes);
    }
    public RecipeDetailDTO getRecipeDetail(Long id) {
        Recipe recipe = recipeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Recipe not found"));

        // レシピに含まれる食材一覧を取得
        List<RecipeIngredientDetailDTO> ingredientDTOs = recipeIngredientRepository.findByRecipeRecipeId(id)
                .stream()
                .map(ri -> new RecipeIngredientDetailDTO(
                        ri.getIngredient().getIngredientId(),
                        ri.getIngredient().getName(),
                        ri.getQuantity(),
                        ri.getIngredient().getUnit(),
                        ri.getOptional()
                ))
                .collect(Collectors.toList());

        // まとめた DTO を返す
        return new RecipeDetailDTO(
                recipe.getRecipeId(),
                recipe.getName(),
                recipe.getInstructions(),
                recipe.getImageURL(),
                recipe.getCuisineType(),
                recipe.getTime(),
                ingredientDTOs
        );
    }
//      public RecipeFilterResponseDTO filterRecipes(String cuisineType, Integer maxTime) {
//         List<Recipe> recipes = recipeRepository.filterRecipes(cuisineType, maxTime);

//         List<RecipeDetailDTO> recipeDTOs = recipes.stream().map(recipe -> {
//             List<RecipeIngredientDetailDTO> ingredientDTOs = recipeIngredientRepository.findByRecipeRecipeId(recipe.getRecipeId())
//                     .stream()
//                     .map(ri -> new RecipeIngredientDetailDTO(
//                             ri.getIngredient().getIngredientId(),
//                             ri.getIngredient().getName(),
//                             ri.getQuantity(),
//                             ri.getIngredient().getUnit(),
//                             ri.getOptional()
//                     ))
//                     .collect(Collectors.toList());

//             return new RecipeDetailDTO(
//                     recipe.getRecipeId(),
//                     recipe.getName(),
//                     recipe.getInstructions(),
//                     recipe.getImageURL(),
//                     recipe.getCuisineType(),
//                     recipe.getTime(),
//                     ingredientDTOs
//             );
//         }).collect(Collectors.toList());

//         Map<String, Object> filters = new HashMap<>();
//         filters.put("cuisine_type", cuisineType);
//         filters.put("max_time", maxTime);

//         return new RecipeFilterResponseDTO(recipeDTOs, filters, recipeDTOs.size());
//     }
        
        public RecipeFilterResponseDTO filterRecipes(String cuisineType, Integer maxTime, String aPartOfName) {
        List<Recipe> recipes = recipeRepository.filterRecipes(cuisineType, maxTime, aPartOfName);

        List<RecipeDetailDTO> recipeDTOs = recipes.stream().map(recipe -> {
                List<RecipeIngredientDetailDTO> ingredientDTOs = recipeIngredientRepository.findByRecipeRecipeId(recipe.getRecipeId())
                        .stream()
                        .map(ri -> new RecipeIngredientDetailDTO(
                                ri.getIngredient().getIngredientId(),
                                ri.getIngredient().getName(),
                                ri.getQuantity(),
                                ri.getIngredient().getUnit(),
                                ri.getOptional()
                        ))
                        .collect(Collectors.toList());

                return new RecipeDetailDTO(
                        recipe.getRecipeId(),
                        recipe.getName(),
                        recipe.getInstructions(),
                        recipe.getImageURL(),
                        recipe.getCuisineType(),
                        recipe.getTime(),
                        ingredientDTOs
                );
        }).collect(Collectors.toList());

        Map<String, Object> filters = new HashMap<>();
        filters.put("cuisine_type", cuisineType);
        filters.put("max_time", maxTime);
        filters.put("a_part_of_name", aPartOfName);

        return new RecipeFilterResponseDTO(recipeDTOs, filters, recipeDTOs.size());
        }
//         @Transactional
//         public List<RecipeSearchResultDTO> searchByIngredients(SearchByIngredientsRequest request) {
//         // time と cuisine_type でレシピを絞り込む
//         List<Recipe> recipes = recipeRepository.findRecipesByIngredientsAndFilters(
//                 request.getIngredientIds(),
//                 request.getMaxTime(),
//                 request.getCuisineType()
//         );

//         List<RecipeSearchResultDTO> results = new ArrayList<>();
        
//         for (Recipe recipe : recipes) {
//             int totalIngredients = recipe.getRecipeIngredients().size();
//             int matchedIngredients = (int) recipe.getRecipeIngredients().stream()
//                     .filter(ri -> request.getIngredientIds().contains(ri.getIngredient().getIngredientId()))
//                     .count();

//             List<MissingIngredientDTO> missingIngredients = recipe.getRecipeIngredients().stream()
//                     .filter(ri -> !request.getIngredientIds().contains(ri.getIngredient().getIngredientId()))
//                     .map(ri -> {
//                         MissingIngredientDTO mi = new MissingIngredientDTO();
//                         mi.setIngredientId(ri.getIngredient().getIngredientId());
//                         mi.setName(ri.getIngredient().getName());
//                         mi.setQuantity(ri.getQuantity());
//                         mi.setUnit(ri.getIngredient().getUnit());

//                         // Check substitute
//                         List<Long> subs = ingredientSubstituteRepository
//                                 .findByOriginalIngredient_IngredientId(ri.getIngredient().getIngredientId())
//                                 .stream()
//                                 .map(s -> s.getSubstituteIngredient().getIngredientId())
//                                 .toList();

//                         mi.setHasSubstitute(!subs.isEmpty());
//                         mi.setSubstituteOptions(subs);
//                         return mi;
//                     })
//                     .toList();

//             RecipeMatchInfoDTO matchInfo = new RecipeMatchInfoDTO();
//             matchInfo.setTotalIngredients(totalIngredients);
//             matchInfo.setMatchedIngredients(matchedIngredients);
//             matchInfo.setMatchPercentage((matchedIngredients * 100.0) / totalIngredients);
//             matchInfo.setMissingIngredients(missingIngredients);

//             RecipeSearchResultDTO dto = new RecipeSearchResultDTO();
//             dto.setRecipeId(recipe.getRecipeId());
//             dto.setName(recipe.getName());
//             dto.setCuisineType(recipe.getCuisineType());
//             dto.setTime(recipe.getTime());
//             dto.setMatchInfo(matchInfo);

//             results.add(dto);
//         }

//         // 一致率の高い順、同率なら調理時間の短い順に並べ替え
//         results.sort((a, b) -> {
//             int percentageCompare = Double.compare(
//                     b.getMatchInfo().getMatchPercentage(), 
//                     a.getMatchInfo().getMatchPercentage()
//             );
//             if (percentageCompare != 0) {
//                 return percentageCompare;
//             }
//             return Integer.compare(a.getTime(), b.getTime());
//         });

//         return results;
//     }
        @Transactional
        public List<RecipeSearchResultDTO> searchByIngredients(SearchByIngredientsRequest request) {
        // time と cuisine_type で全レシピを絞り込む
        // 食材での絞り込みはここでは行わず、後の Java 処理で行う
        List<Recipe> allRecipes = recipeRepository.findRecipesByFilters(
                request.getMaxTime(),
                request.getCuisineType()
        );

        List<RecipeSearchResultDTO> results = new ArrayList<>();
        Set<Long> userSelectedIngredients = new HashSet<>(request.getIngredientIds());
        
        for (Recipe recipe : allRecipes) {
                // このレシピの全食材IDを取得
                Set<Long> recipeIngredientIds = recipe.getRecipeIngredients().stream()
                        .map(ri -> ri.getIngredient().getIngredientId())
                        .collect(Collectors.toSet());
                
                // 一致する食材の数を数える
                Set<Long> matchedIngredientIds = new HashSet<>(userSelectedIngredients);
                matchedIngredientIds.retainAll(recipeIngredientIds); // Intersection
                
                int matchedIngredients = matchedIngredientIds.size();
                
                // 一致する食材が1つ以上あるレシピのみ追加
                if (matchedIngredients > 0) {
                // int totalUserIngredients = request.getIngredientIds().size();
                int totalRecipeIngredients = recipe.getRecipeIngredients().size();
                
                // 不足食材を算出（レシピに必要だがユーザーが持っていない食材）
                List<MissingIngredientDTO> missingIngredients = recipe.getRecipeIngredients().stream()
                        .filter(ri -> !userSelectedIngredients.contains(ri.getIngredient().getIngredientId()))
                        .map(ri -> {
                                MissingIngredientDTO mi = new MissingIngredientDTO();
                                mi.setIngredientId(ri.getIngredient().getIngredientId());
                                mi.setName(ri.getIngredient().getName());
                                mi.setQuantity(ri.getQuantity());
                                mi.setUnit(ri.getIngredient().getUnit());

                                // Check substitute
                                List<Long> subs = ingredientSubstituteRepository
                                        .findByOriginalIngredient_IngredientId(ri.getIngredient().getIngredientId())
                                        .stream()
                                        .map(s -> s.getSubstituteIngredient().getIngredientId())
                                        .toList();

                                mi.setHasSubstitute(!subs.isEmpty());
                                mi.setSubstituteOptions(subs);
                                return mi;
                        })
                        .toList();

                RecipeMatchInfoDTO matchInfo = new RecipeMatchInfoDTO();
                matchInfo.setTotalIngredients(totalRecipeIngredients);
                matchInfo.setMatchedIngredients(matchedIngredients);
                
                // レシピの食材を基準に一致率を算出（レシピの何%を満たしているか）
                matchInfo.setMatchPercentage((matchedIngredients * 100.0) / totalRecipeIngredients);
                matchInfo.setMissingIngredients(missingIngredients);

                // ユーザーカバー率を追加（選んだ食材の何%が使われるか）
                // double userCoveragePercentage = (matchedIngredients * 100.0) / totalUserIngredients;

                RecipeSearchResultDTO dto = new RecipeSearchResultDTO();
                dto.setRecipeId(recipe.getRecipeId());
                dto.setName(recipe.getName());
                dto.setCuisineType(recipe.getCuisineType());
                dto.setTime(recipe.getTime());
                dto.setMatchInfo(matchInfo);
                // 必要なら userCoveragePercentage を DTO に追加できる

                results.add(dto);
                }
        }

        // 一致率の高い順、同率なら調理時間の短い順に並べ替え
        results.sort((a, b) -> {
                int percentageCompare = Double.compare(
                        b.getMatchInfo().getMatchPercentage(), 
                        a.getMatchInfo().getMatchPercentage()
                );
                if (percentageCompare != 0) {
                return percentageCompare;
                }
                return Integer.compare(a.getTime(), b.getTime());
        });

        return results;
        }
}
